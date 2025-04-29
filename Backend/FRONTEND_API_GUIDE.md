# Echo API Frontend Integration Guide

## 1. Registration
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "nickname": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "bio": "Hello, I'm John!"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Registration successful",
    "user": {
      "id": 1,
      "username": "johndoe",
      "nickname": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

## 2. Login
- **URL**: `http://localhost:5000/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "user": {
      "id": 1,
      "username": "johndoe",
      "nickname": "John Doe",
      "email": "john@example.com",
      "avatar": "default_avatar.jpg",
      "bio": "Hello, I'm John!",
      "is_admin": false
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Note**: Save the returned `access_token`, as it's required for authenticated requests

## 3. Get Current User Information
- **URL**: `http://localhost:5000/api/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer your_access_token`
- **Response**:
  ```json
  {
    "status": "success",
    "user": {
      "id": 1,
      "username": "johndoe",
      "nickname": "John Doe",
      "email": "john@example.com",
      "bio": "Hello, I'm John!",
      "avatar": "default_avatar.jpg",
      "created_at": "2023-04-29T10:30:00.000000",
      "followers_count": 0,
      "following_count": 0,
      "is_admin": false
    }
  }
  ```

## 4. Check Admin Status
- **URL**: `http://localhost:5000/api/auth/check-admin`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer your_access_token`
- **Response**:
  ```json
  {
    "status": "success",
    "is_admin": false
  }
  ```

## Admin Account
- Username: `admin`
- Password: `admin`
- Email: `admin@123.com`
- Nickname: `Admin`

## JavaScript Example Code

```javascript
// Registration example
async function register(username, nickname, email, password, bio) {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, nickname, email, password, bio })
  });
  return await response.json();
}

// Login example
async function login(username, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  
  // Save token to localStorage
  if (data.status === 'success') {
    localStorage.setItem('token', data.access_token);
  }
  
  return data;
}

// Get current user info example
async function getCurrentUser() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}

// Check admin status example
async function checkIsAdmin() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/check-admin', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}
```

## Registration Constraints
- **Username**: 
  - Must be between 3-20 characters
  - Can only contain letters, numbers, and underscores
  - Must be unique
- **Nickname**:
  - Cannot exceed 50 characters
  - Optional (defaults to username if not provided)
- **Email**:
  - Must be a valid email format
  - Must be unique
- **Password**:
  - Must be at least 6 characters
- **Bio**:
  - Cannot exceed 200 characters
  - Optional

## Error Handling
All API requests will return consistent error formats:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common error status codes:
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid or missing token)
- `404`: Not Found
- `500`: Server Error 