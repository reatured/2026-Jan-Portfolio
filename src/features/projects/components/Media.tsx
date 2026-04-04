import React from 'react';
import { MediaItem } from '../../../features/common/types';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

interface MediaProps {
  item: MediaItem;
  className?: string;
  priority?: boolean;
  frameSx?: SxProps<Theme>;
  autoPlayVideo?: boolean;
}

export const Media: React.FC<MediaProps> = ({ item, className = "", frameSx, autoPlayVideo }) => {
  const frameClassName = `project-media-frame ${item.layout ? `project-media-${item.layout}` : ''} ${className}`.trim();
  const visualClassName = 'project-media-visual';
  const frameStyles = {
    position: 'relative',
    overflow: 'hidden',
    bgcolor: 'secondaryContainer',
    borderRadius: '6px',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.22)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transform: 'translateZ(0)',
  } as const;

  if (item.type === 'iframe') {
    return (
      <Box
        className={frameClassName}
        sx={{
          ...frameStyles,
          height:
            item.layout === 'full-width'
              ? { xs: '380px', md: '480px', lg: item.height ? `${item.height}px` : '560px' }
              : item.height
                ? { xs: '300px', md: `${item.height}px` }
                : undefined,
          aspectRatio: item.height ? undefined : (item.aspectRatio || '16 / 9'),
          ...frameSx,
        }}
      >
        <iframe
          className={visualClassName}
          src={item.src}
          title={item.title || "Interactive Content"}
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          allow={item.allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
          allowFullScreen
        />
      </Box>
    );
  }

  if (item.type === 'video') {
    return (
      <Box
        className={frameClassName}
        sx={{ ...frameStyles, ...frameSx }}
      >
        <video
          className={visualClassName}
          src={item.src}
          poster={item.poster}
          controls={!autoPlayVideo}
          autoPlay={autoPlayVideo}
          loop={autoPlayVideo}
          muted={autoPlayVideo}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
    );
  }

  return (
    <Box
      className={frameClassName}
      sx={{ ...frameStyles, ...frameSx }}
    >
      <Box
        component="img"
        className={visualClassName}
        src={item.src}
        alt={item.alt || "Project media"}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  );
};
