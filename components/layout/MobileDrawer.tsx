import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Sidebar } from './Sidebar';

interface MobileDrawerProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onOpen, onClose }) => {
  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          bgcolor: 'background.default',
          p: 2.5,
          pt: 1.5,
          borderRadius: '0 28px 28px 0',
        },
      }}
      role="navigation"
      aria-label="Site navigation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <IconButton onClick={onClose} aria-label="Close navigation" size="small" sx={{ borderRadius: '8px' }}>
          <CloseIcon sx={{ fontSize: '1.1rem' }} />
        </IconButton>
      </Box>
      <Sidebar />
    </SwipeableDrawer>
  );
};
