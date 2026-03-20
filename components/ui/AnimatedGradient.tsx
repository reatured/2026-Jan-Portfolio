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
  intensity = 'medium',
  sx 
}) => {
  const theme = useTheme();
  
  const gradientMap = {
    primary: theme.palette.gradients.primary,
    secondary: theme.palette.gradients.secondary,
    text: theme.palette.gradients.text,
  };
  
  const intensityMap = {
    subtle: { opacity: 0.6, scale: 1 },
    medium: { opacity: 0.8, scale: 1.02 },
    strong: { opacity: 1, scale: 1.05 },
  };
  
  return (
    <Box
      sx={{
        position: 'relative',
        ...intensityMap[intensity],
        ...sx,
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: gradientMap[variant],
          borderRadius: 'inherit',
          opacity: intensity === 'subtle' ? 0.3 : intensity === 'medium' ? 0.5 : 0.7,
          animation: 'gradientShift 3s ease-in-out infinite',
          '@keyframes gradientShift': {
            '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
            '50%': { transform: 'scale(1.1) rotate(180deg)' },
          },
        }}
      />
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
