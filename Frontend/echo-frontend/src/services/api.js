// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * 发送API请求的通用函数
 * @param {string} endpoint - API端点
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应数据
 */
export const apiRequest = async (endpoint, options = {}) => {
  // 构建完整URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 设置默认headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // 如果本地存储中有访问令牌，则添加到headers
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  // 合并选项
  const requestOptions = {
    ...options,
    headers
  };
  
  try {
    // 发送请求
    const response = await fetch(url, requestOptions);
    
    // 尝试解析响应
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // 如果无法解析JSON，提供一个默认的响应数据
      data = {
        status: 'error',
        message: '无法解析服务器响应'
      };
    }
    
    // 如果响应不成功，抛出错误
    if (!response.ok) {
      // 特殊处理401错误（未授权/令牌过期）
      if (response.status === 401) {
        // 清除令牌和用户信息
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // 创建一个包含状态码的错误对象
        const error = new Error(data.message || '未授权');
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      // 创建一个包含状态码和响应数据的错误对象
      const error = new Error(data.message || `请求失败: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

/**
 * 身份验证相关API
 */
export const authAPI = {
  // 用户注册
  register: (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  // 用户登录
  login: async (credentials) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      // 登录成功，保存用户信息和令牌
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
      }
      
      return data;
    } catch (error) {
      // 确保登录失败时清除任何可能存在的旧数据
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  },
  
  // 用户登出
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  // 检查用户是否已登录
  isLoggedIn: () => {
    return !!localStorage.getItem('access_token') && !!localStorage.getItem('user');
  }
};

/**
 * 用户相关API
 */
export const userAPI = {
  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me', {
        method: 'GET'
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      if (error.status === 401) {
        throw new Error('未授权访问，请先登录');
      } else if (error.status === 404) {
        throw new Error('用户未找到');
      } else {
        throw new Error('获取用户信息失败: ' + (error.message || '未知错误'));
      }
    }
  },
  
  // 更新用户信息
  updateProfile: async (userData) => {
    try {
      const response = await apiRequest('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      
      // 更新本地存储的用户信息
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },
  
  // 上传头像
  uploadAvatar: async (formData) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.message || 'Upload failed');
        error.status = response.status;
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  }
};

export default {
  auth: authAPI,
  user: userAPI
}; 