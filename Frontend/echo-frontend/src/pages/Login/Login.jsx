import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (formData) => {
    try {
      setError('');
      setLoading(true);
      
      // 模拟登录API调用
      // 实际项目中将替换为真实的API调用
      console.log('Login attempt:', formData);
      
      // 模拟登录成功
      setTimeout(() => {
        setLoading(false);
        // 模拟登录成功，保存用户信息到本地
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: formData.username
        }));
        alert('Login successful!');
        navigate('/');
      }, 1000);
      
      /* 
      // 真实API调用示例
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // 登录成功，保存用户信息到本地
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      */
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
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