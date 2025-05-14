import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Grid, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import { userAPI } from '../../services/api';
import './Profile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    password: '',
    bio: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const avatarUrl = user && user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}${user.avatar}`)
    : "/default-avatar.png";

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getCurrentUser();
      setUser(data.user);
      setEditForm({
        nickname: data.user?.nickname || '',
        password: '',
        bio: data.user?.bio || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only submit fields that have values
      const updateData = {};
      if (editForm.nickname) updateData.nickname = editForm.nickname;
      if (editForm.password) updateData.password = editForm.password;
      if (editForm.bio) updateData.bio = editForm.bio;

      const response = await userAPI.updateProfile(updateData);
      setUser(response.user);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Update failed, please try again',
        severity: 'error'
      });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setAvatarError('');
    if (!file) return;
    // 校验文件类型和大小
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Only png, jpg, jpeg, gif files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('File size must be less than 2MB.');
      return;
    }
    // 预览
    setAvatarPreview(URL.createObjectURL(file));
    // 上传
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarUploading(true);
    try {
      const res = await userAPI.uploadAvatar(formData);
      setSnackbar({
        open: true,
        message: 'Avatar uploaded successfully',
        severity: 'success'
      });
      // 立即刷新用户信息并同步localStorage
      const freshUser = await userAPI.getCurrentUser();
      setUser(freshUser.user);
      localStorage.setItem('user', JSON.stringify(freshUser.user));
      setAvatarPreview(null);
    } catch (err) {
      setAvatarError(err.message || 'Upload failed');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <Box className="loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error">
        <Typography variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="error">
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back to Home
            </Button>
            <Typography variant="h4" component="h1">
              Profile
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={avatarUrl}
              alt={user.nickname || user.username}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              onError={e => { e.target.src = "/default-avatar.png"; }}
            >
              {(user.nickname || user.username)?.charAt(0)}
            </Avatar>
            <Typography variant="h6">
              {user.nickname || user.username}
            </Typography>
            {user.is_admin && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'inline-block',
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mt: 1
                }}
              >
                Admin
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Username
              </Typography>
              <Typography variant="body1">
                {user.username}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Bio
              </Typography>
              <Typography variant="body1">
                {user.bio || 'No bio yet'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Join Date
              </Typography>
              <Typography variant="body1">
                {new Date(user.created_at).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Followers
                </Typography>
                <Typography variant="body1">
                  {user.followers_count}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Following
                </Typography>
                <Typography variant="body1">
                  {user.following_count}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {/* 头像上传 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={avatarPreview || avatarUrl}
                alt={user.nickname || user.username}
                sx={{ width: 64, height: 64, mr: 2 }}
                onError={e => { e.target.src = "/default-avatar.png"; }}
              >
                {(user.nickname || user.username)?.charAt(0)}
              </Avatar>
              <label htmlFor="avatar-upload">
                <input
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  id="avatar-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? 'Uploading...' : 'Upload Avatar'}
                </Button>
              </label>
            </Box>
            {avatarError && (
              <Alert severity="error" sx={{ mb: 2 }}>{avatarError}</Alert>
            )}
            {/* 其他表单字段 */}
            <TextField
              fullWidth
              label="Nickname"
              name="nickname"
              value={editForm.nickname}
              onChange={handleInputChange}
              margin="normal"
              helperText="1-50 characters"
            />
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type="password"
              value={editForm.password}
              onChange={handleInputChange}
              margin="normal"
              helperText="At least 6 characters, leave blank to keep current"
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={editForm.bio}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              helperText="Maximum 200 characters"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 