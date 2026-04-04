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
  count = 3, // Reduced from 6-12 to 3
  size = 'medium',
  opacity = 0.3, // Reduced opacity
  sx 
}) => {
  const theme = useTheme();
  
  const sizeMap = {
    small: { min: 4, max: 8 },
    medium: { min: 8, max: 12 },
    large: { min: 12, max: 16 },
  };
  
  const shapes = Array.from({ length: count }, (_, i) => {
    const shapeSize = Math.random() * (sizeMap[size].max - sizeMap[size].min) + sizeMap[size].min;
    const duration = 20 + Math.random() * 10; // 20-30s (slower, more consistent)
    const delay = Math.random() * 5; // 0-5s delay
    
    return {
      id: i,
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
            animation: `float ${shape.duration}s ${shape.delay}s ease-in-out infinite`,
            '@keyframes float': {
              '0%, 100%': { 
                transform: 'translate(0, 0) scale(1)' 
              },
              '50%': { 
                transform: 'translate(20px, -20px) scale(1.1)' 
              },
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
            }}
          />
        </Box>
      ))}
    </Box>
  );
};
