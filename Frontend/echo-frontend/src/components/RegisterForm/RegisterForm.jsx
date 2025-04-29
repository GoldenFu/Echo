import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    // 用户名验证
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = 'Username must be between 3-20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers and underscores';
    }
    
    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // 密码验证
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // 确认密码
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // 个人简介验证
    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = 'Bio cannot exceed 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // 移除确认密码字段，后端API不需要
      const { confirmPassword, ...registerData } = formData;
      onRegister && onRegister(registerData);
    }
  };

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
          <small className="form-text">3-20 characters, letters, numbers and underscores only</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          <small className="form-text">At least 6 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Bio <span className="optional">(Optional)</span></label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={errors.bio ? 'error' : ''}
            rows="3"
            maxLength="200"
          ></textarea>
          {errors.bio && <div className="error-message">{errors.bio}</div>}
          <small className="form-text">{formData.bio.length}/200 characters</small>
        </div>
        
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm; 