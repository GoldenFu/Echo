import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 检查用户是否已登录
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else {
      // 如果没有登录，重定向到登录页面
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    // 清除本地存储的用户信息
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  if (!user) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Echo</h1>
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main className="home-content">
        <div className="welcome-message">
          <h2>Welcome to Echo</h2>
          <p>This is your home page. You've successfully logged in!</p>
        </div>
      </main>
    </div>
  );
};

export default Home; 