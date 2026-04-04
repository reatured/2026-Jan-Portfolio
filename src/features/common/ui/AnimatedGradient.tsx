import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface AnimatedGradientProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  intensity?: 'subtle' | 'medium' | 'strong';
  sx?: any;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ 
  children, 
  variant = 'primary',
  intensity = 'subtle', // Default to subtle
  sx 
}) => {
  const theme = useTheme();
  
  const gradientMap = {
    primary: theme.palette.gradients?.primary || `${theme.palette.primary.main}20`,
    secondary: theme.palette.gradients?.secondary || `${theme.palette.secondary.main}20`,
    text: theme.palette.gradients?.text || `${theme.palette.text.primary}20`,
  };
  
  const intensityMap = {
    subtle: { opacity: 0.3, scale: 1 },
    medium: { opacity: 0.5, scale: 1 },
    strong: { opacity: 0.7, scale: 1 },
  };
  
  // Remove continuous animation for better performance
  return (
    <Box
      sx={{
        position: 'relative',
        ...intensityMap[intensity],
        ...sx,
      }}
    >
      {/* Static gradient background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: gradientMap[variant],
          borderRadius: 'inherit',
          opacity: intensityMap[intensity].opacity,
        }}
      />
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
