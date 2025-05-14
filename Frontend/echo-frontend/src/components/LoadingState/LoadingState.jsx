import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import './LoadingState.css';

const LoadingState = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}
      className="loading-state"
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingState; 