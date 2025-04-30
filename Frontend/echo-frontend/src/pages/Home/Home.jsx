import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // 检查用户是否已登录
    const fetchUserData = async () => {
      // 首先检查是否已登录
      if (!authAPI.isLoggedIn()) {
        // 如果没有登录，重定向到登录页面
        navigate('/login');
        return;
      }
      
      try {
        // 尝试从本地存储获取用户信息
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          throw new Error('未找到用户数据');
        }
        
        // 先设置本地存储的用户数据
        setUser(userData);
        
        // 尝试从API获取最新的用户信息
        try {
          const freshUserData = await userAPI.getCurrentUser();
          if (freshUserData && freshUserData.user) {
            setUser(freshUserData.user);
            localStorage.setItem('user', JSON.stringify(freshUserData.user));
          }
        } catch (apiError) {
          console.warn('无法获取最新用户数据:', apiError);
          // 如果API请求失败，但有本地用户数据，继续使用本地数据
          // 如果API请求返回401（未授权），authAPI会自动清除用户数据并重定向到登录页
        }
      } catch (err) {
        console.error('Home页面错误:', err);
        setError('无法加载用户数据，请重新登录');
        // 延迟2秒后重定向到登录页
        setTimeout(() => {
          authAPI.logout();
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleLogout = () => {
    // 使用API服务处理登出
    authAPI.logout();
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!user) {
    return <div className="error">用户数据不可用，请<a href="/login" onClick={(e) => {
      e.preventDefault();
      navigate('/login');
    }}>重新登录</a></div>;
  }
  
  // 显示昵称，如果没有昵称则回退到用户名
  const displayName = user.nickname || user.username;
  
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Echo</h1>
        <div className="user-info">
          {user.avatar && (
            <div className="avatar-container">
              <img src={user.avatar} alt={`${displayName}'s avatar`} className="user-avatar" />
            </div>
          )}
          <span>Welcome, {displayName}</span>
          {user.is_admin && <span className="admin-badge">Admin</span>}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main className="home-content">
        <div className="welcome-message">
          <h2>Welcome to Echo</h2>
          <p>This is your home page. You've successfully logged in!</p>
          
          <div className="user-details">
            <h3>Your Profile</h3>
            <div className="profile-info">
              <p><strong>Username:</strong> {user.username}</p>
              {user.email && <p><strong>Email:</strong> {user.email}</p>}
              {user.bio && (
                <div className="user-bio">
                  <h4>About you</h4>
                  <p>{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 