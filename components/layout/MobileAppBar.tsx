import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { siteConfig } from '../../config/site';
import { M3 } from '../../theme';

interface MobileAppBarProps {
  onMenuClick: () => void;
}

export const MobileAppBar: React.FC<MobileAppBarProps> = ({ onMenuClick }) => {
  return (
    <Box
      component="nav"
      sx={{
        display: { xs: 'flex', lg: 'none' },
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        height: 52,
        px: 1,
        bgcolor: `${M3.surfaceContainerLow}E6`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 1px 0 ${M3.outlineVariant}40`,
      }}
    >
      <IconButton
        onClick={onMenuClick}
        aria-label="Open navigation"
        size="small"
        sx={{ color: 'text.primary', borderRadius: '8px' }}
      >
        <MenuIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>
      <Typography
        sx={{
          ml: 1.5,
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        {siteConfig.siteName}
      </Typography>
    </Box>
  );
};
