import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { authAPI } from '../../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 页面加载时检查用户是否已登录，如果已登录则重定向到首页
  useEffect(() => {
    if (authAPI.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleRegister = async (formData) => {
    try {
      setError('');
      setLoading(true);
      
      // 使用API服务调用注册
      const data = await authAPI.register(formData);
      
      // 注册成功，显示消息
      alert(data.message || 'Registration successful!');
      
      // 跳转到登录页面
      navigate('/login');
    } catch (err) {
      // 设置错误信息
      console.error('Registration error:', err);
      
      // 根据错误类型设置不同的错误消息
      if (err.status === 400) {
        setError(err.message || '请检查您的注册信息');
      } else if (err.status === 409) {
        setError('用户名或邮箱已存在');
      } else {
        setError(err.message || '注册失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-content">
        {error && <div className="error-alert">{error}</div>}
        
        <RegisterForm onRegister={handleRegister} />
        
        <div className="register-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
        
        {loading && <div className="loading-indicator">Processing...</div>}
      </div>
    </div>
  );
};

export default Register; 