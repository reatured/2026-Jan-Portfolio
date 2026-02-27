import React from 'react';
import Chip from '@mui/material/Chip';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'outline' }> = ({
  children,
  variant = 'default',
}) => {
  return (
    <Chip
      label={children}
      size="small"
      variant={variant === 'outline' ? 'outlined' : 'filled'}
      sx={{ fontSize: '0.7rem', height: 22 }}
    />
  );
};
