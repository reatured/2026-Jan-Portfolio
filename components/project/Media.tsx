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
          bgcolor: 'secondaryContainer',
          borderRadius: '16px',
          height: item.height ? `${item.height}px` : undefined,
          aspectRatio: item.height ? undefined : '16/9',
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
        sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'secondaryContainer', borderRadius: '16px' }}
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
      sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'secondaryContainer', borderRadius: '16px' }}
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
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
};
