import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async (formData) => {
    try {
      setError('');
      setLoading(true);
      
      // 调用注册API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // 如果响应不成功，抛出错误
        throw new Error(data.message || 'Registration failed');
      }
      
      // 注册成功
      alert(data.message || 'Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      // 设置错误信息
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
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