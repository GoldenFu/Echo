import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './ErrorState.css';

const ErrorState = ({ message, buttonText, onButtonClick }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        p: 3
      }}
      className="error-state"
    >
      <Typography variant="h6" color="error" gutterBottom>
        {message || 'An error occurred'}
      </Typography>
      {buttonText && onButtonClick && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onButtonClick}
          sx={{ mt: 2 }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState; 