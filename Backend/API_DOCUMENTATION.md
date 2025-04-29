# Echo API 文档

## 基本信息

- 基础URL: `http://localhost:5000`
- 所有API返回JSON格式数据
- 大多数API需要JWT认证

## 响应格式

所有API响应遵循以下格式：

```json
{
  "status": "success",  // 或 "error"
  "message": "操作成功信息",  // 或错误信息
  "data": {}  // 可选，包含返回的数据
}
```

## 认证相关API

### 注册

- **URL**: `/api/auth/register`
- **方法**: `POST`
- **认证**: 不需要
- **描述**: 创建新用户账号

**请求体**:
```json
{
  "username": "用户名",  // 必填，3-20个字符，只允许字母、数字和下划线
  "email": "邮箱地址",  // 必填，有效的邮箱格式
  "password": "密码",  // 必填，至少6个字符
  "bio": "个人简介"  // 可选，最多200个字符
}
```

**成功响应** (201 Created):
```json
{
  "status": "success",
  "message": "注册成功",
  "user": {
    "id": 1,
    "username": "用户名",
    "email": "邮箱地址"
  }
}
```

**错误响应** (400 Bad Request):
```json
{
  "status": "error",
  "message": "错误信息" // 如"用户名已存在"、"邮箱已被注册"等
}
```

### 登录

- **URL**: `/api/auth/login`
- **方法**: `POST`
- **认证**: 不需要
- **描述**: 用户登录并获取访问令牌

**请求体**:
```json
{
  "username": "用户名或邮箱",  // 必填
  "password": "密码"  // 必填
}
```

**成功响应** (200 OK):
```json
{
  "status": "success",
  "message": "登录成功",
  "user": {
    "id": 1,
    "username": "用户名",
    "email": "邮箱地址",
    "avatar": "头像URL",
    "bio": "个人简介",
    "is_admin": false
  },
  "access_token": "JWT访问令牌",
  "refresh_token": "JWT刷新令牌"
}
```

**错误响应** (401 Unauthorized):
```json
{
  "status": "error",
  "message": "用户名或密码错误"
}
```

### 获取当前用户信息

- **URL**: `/api/auth/me`
- **方法**: `GET`
- **认证**: 需要JWT令牌
- **描述**: 获取当前登录用户的详细信息

**请求头**:
```
Authorization: Bearer 你的JWT令牌
```

**成功响应** (200 OK):
```json
{
  "status": "success",
  "user": {
    "id": 1,
    "username": "用户名",
    "email": "邮箱地址",
    "bio": "个人简介",
    "avatar": "头像URL",
    "created_at": "2023-04-29T10:30:00.000000",
    "followers_count": 10,
    "following_count": 20,
    "is_admin": false
  }
}
```

**错误响应** (401 Unauthorized):
```json
{
  "status": "error",
  "message": "未授权访问，请先登录"
}
```

### 检查管理员权限

- **URL**: `/api/auth/check-admin`
- **方法**: `GET`
- **认证**: 需要JWT令牌
- **描述**: 检查当前用户是否具有管理员权限

**请求头**:
```
Authorization: Bearer 你的JWT令牌
```

**成功响应** (200 OK):
```json
{
  "status": "success",
  "is_admin": true  // 或 false
}
```

**错误响应** (401 Unauthorized):
```json
{
  "status": "error",
  "message": "未授权访问，请先登录"
}
```

## 用户相关API

*待实现*

## 推文相关API

*待实现*

## 点赞相关API

*待实现*

## 评论相关API

*待实现*

## 搜索相关API

*待实现*

## 通知相关API

*待实现*

## 管理相关API

*待实现*

## 认证说明

大多数API需要JWT认证。在请求头中添加：

```
Authorization: Bearer 你的JWT令牌
```

JWT令牌可以通过登录API获取，有效期为1小时。刷新令牌有效期为30天。

## 状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权访问
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器错误

## 错误处理

所有API错误都会返回适当的HTTP状态码和JSON格式的错误信息：

```json
{
  "status": "error",
  "message": "详细错误信息"
}
``` 