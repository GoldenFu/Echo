import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper,
  Grid, 
  Divider,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  Event as EventIcon
} from '@mui/icons-material';
import './UserProfile.css';

const UserProfile = ({ user, onBackClick }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const joinDate = formatDate(user?.created_at);

  if (!user) {
    return null;
  }

  return (
    <Paper elevation={0} className="profile-container">
      {/* Header with background and back button */}
      <Box className="profile-header-background">
        <Box className="profile-header-buttons">
          <IconButton 
            className="profile-back-button" 
            onClick={onBackClick}
            sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Profile avatar and edit button */}
      <Box className="profile-avatar-container">
        <Avatar 
          src={user.avatar} 
          alt={user.nickname || user.username}
          className="profile-avatar"
        >
          {(user.nickname || user.username).charAt(0)}
        </Avatar>
        
        <Button 
          variant="outlined" 
          className="profile-edit-button"
          startIcon={<EditIcon />}
        >
          Edit Profile
        </Button>
      </Box>
      
      {/* User info */}
      <Box className="profile-info">
        <Typography variant="h5" className="profile-display-name">
          {user.nickname || user.username}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" className="profile-username">
          @{user.username}
        </Typography>
        
        {user.bio && (
          <Typography variant="body1" className="profile-bio" sx={{ mt: 1, mb: 2 }}>
            {user.bio}
          </Typography>
        )}
        
        <Box className="profile-metadata">
          {user.location && (
            <Box className="profile-metadata-item">
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.location}
              </Typography>
            </Box>
          )}
          
          <Box className="profile-metadata-item">
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Joined {joinDate}
            </Typography>
          </Box>
        </Box>
        
        <Box className="profile-stats">
          <Box className="profile-stat-item" sx={{ mr: 3 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
              {user.following_count || 0}
            </Typography>
            <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
              Following
            </Typography>
          </Box>
          
          <Box className="profile-stat-item">
            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
              {user.followers_count || 0}
            </Typography>
            <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
              Followers
            </Typography>
          </Box>
        </Box>
      </Box>
      


      

    </Paper>
  );
};

export default UserProfile; 