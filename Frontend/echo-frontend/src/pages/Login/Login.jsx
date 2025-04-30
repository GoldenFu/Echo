import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import { authAPI } from '../../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 页面加载时检查用户是否已登录，如果已登录则重定向到首页
  useEffect(() => {
    // 检查localStorage中是否有有效的用户和令牌
    if (authAPI.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleLogin = async (formData) => {
    try {
      setError(''); // 清除之前的错误
      setLoading(true);
      
      // 使用API服务调用登录
      const data = await authAPI.login(formData);
      
      // 登录成功，保存用户信息和令牌
      if (data.user) {
        // 保存用户信息
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 保存令牌
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        
        // 显示成功消息
        alert(data.message || 'Login successful!');
        
        // 导航到首页
        navigate('/');
      } else {
        throw new Error('User data not received from server');
      }
    } catch (err) {
      // 处理错误
      console.error('Login error:', err);
      
      // 设置错误信息，确保显示友好的错误消息
      if (err.status === 401) {
        setError('Invalid username or password');
      } else if (err.status === 400) {
        setError('Please provide username and password');
      } else {
        setError(err.message || 'Login failed, please try again later');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-content">
        {error && <div className="error-alert">{error}</div>}
        
        <LoginForm onLogin={handleLogin} />
        
        <div className="login-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
        
        {loading && <div className="loading-indicator">Processing...</div>}
      </div>
    </div>
  );
};

export default Login; 