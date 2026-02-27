import React from 'react';
import { MediaItem } from '../../types';
import Box from '@mui/material/Box';

interface MediaProps {
  item: MediaItem;
  className?: string;
  priority?: boolean;
}

export const Media: React.FC<MediaProps> = ({ item, className = "" }) => {
  if (item.type === 'iframe') {
    return (
      <Box
        className={className}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.100',
          borderRadius: 3,
          height: item.height ? `${item.height}px` : undefined,
        }}
      >
        <iframe
          src={item.src}
          title={item.title || "Interactive Content"}
          style={{ width: '100%', height: '100%', border: 0 }}
          allow={item.allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
          allowFullScreen
        />
      </Box>
    );
  }

  if (item.type === 'video') {
    return (
      <Box
        className={className}
        sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'grey.100', borderRadius: 3 }}
      >
        <video
          src={item.src}
          poster={item.poster}
          controls
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'grey.100', borderRadius: 3 }}
    >
      <Box
        component="img"
        src={item.src}
        alt={item.alt || "Project media"}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.7s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      />
    </Box>
  );
};
