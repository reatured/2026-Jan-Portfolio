import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface FloatingShapesProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
  opacity?: number;
  sx?: any;
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({ 
  count = 6,
  size = 'medium',
  opacity = 0.6,
  sx 
}) => {
  const theme = useTheme();
  
  const sizeMap = {
    small: { min: 4, max: 12 },
    medium: { min: 8, max: 20 },
    large: { min: 16, max: 32 },
  };
  
  const shapes = Array.from({ length: count }, (_, i) => {
    const shapeType = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
    const shapeSize = Math.random() * (sizeMap[size].max - sizeMap[size].min) + sizeMap[size].min;
    const duration = 15 + Math.random() * 20; // 15-35s
    const delay = Math.random() * 10; // 0-10s delay
    
    return {
      id: i,
      type: shapeType,
      size: shapeSize,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration,
      delay,
    };
  });
  
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {shapes.map((shape) => (
        <Box
          key={shape.id}
          sx={{
            position: 'absolute',
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            opacity,
            animation: `float${shape.duration} ${shape.duration}s ${shape.delay}s ease-in-out infinite`,
            '@keyframes float0': {
              '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
              '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
              '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
            },
            '@keyframes float15': {
              '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
              '33%': { transform: 'translate(-25px, 35px) rotate(120deg)' },
              '66%': { transform: 'translate(40px, -15px) rotate(240deg)' },
            },
            '@keyframes float20': {
              '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
              '33%': { transform: 'translate(35px, 25px) rotate(120deg)' },
              '66%': { transform: 'translate(-30px, -20px) rotate(240deg)' },
            },
            // Generate unique keyframes for each shape
            [`@keyframes float${shape.duration}`]: {
              '0%, 100%': { 
                transform: `translate(0, 0) rotate(0deg) scale(1)` 
              },
              '25%': { 
                transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) rotate(90deg) scale(${0.8 + Math.random() * 0.4})` 
              },
              '50%': { 
                transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) rotate(180deg) scale(${0.8 + Math.random() * 0.4})` 
              },
              '75%': { 
                transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) rotate(270deg) scale(${0.8 + Math.random() * 0.4})` 
              },
            },
          }}
        >
          {shape.type === 0 && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: theme.palette.gradients.primary,
              }}
            />
          )}
          {shape.type === 1 && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: theme.palette.gradients.secondary,
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {shape.type === 2 && (
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size/2}px solid transparent`,
                borderRight: `${shape.size/2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${theme.palette.primary}`,
                opacity: 0.7,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};
