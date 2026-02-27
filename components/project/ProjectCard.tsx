import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Media } from './Media';
import { siteConfig } from '../../config/site';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const techLines = project.techStack.map(group => `${group.category}: ${group.skills.join(', ')}`);

  const thumbnailSrc = project.thumbnail;
  const ytId = thumbnailSrc ? getYouTubeId(thumbnailSrc) : null;
  const thumbnailIsVideo = thumbnailSrc && !ytId && isVideoUrl(thumbnailSrc);

  const cardMedia: import('../../types').MediaItem =
    !thumbnailSrc || ytId
      ? project.featuredMedia.type === 'image'
        ? project.featuredMedia
        : { type: 'image', src: siteConfig.defaultOgImage, alt: `${project.title} preview` }
      : { type: 'image', src: thumbnailSrc, alt: `${project.title} thumbnail` };

  return (
    <Card
      component={Link}
      to={`/projects/${project.slug}`}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 3,
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'text.secondary',
          outlineOffset: 2,
        },
      }}
    >
      <CardActionArea
        component="div"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          flexGrow: 1,
        }}
      >
        {/* Media Section */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '40%' },
            aspectRatio: '16/9',
            flexShrink: 0,
            overflow: 'hidden',
            borderRadius: 0,
          }}
        >
          {ytId ? (
            <>
              <Box
                component="img"
                src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                alt={`${project.title} thumbnail`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 40, height: 40, bgcolor: '#dc2626', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 3, opacity: 0.8,
                    '.MuiCardActionArea-root:hover &': { opacity: 1 },
                    transition: 'opacity 0.2s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Box>
              </Box>
            </>
          ) : thumbnailIsVideo ? (
            <Box
              component="video"
              src={thumbnailSrc}
              autoPlay
              muted
              loop
              playsInline
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Media item={cardMedia} className="h-full w-full" />
          )}

          <Box
            sx={{
              position: 'absolute', top: 12, right: 12,
              bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
              px: 1, py: 0.25, borderRadius: 1,
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em',
              fontWeight: 700, color: 'text.primary',
              opacity: 0,
              '.MuiCardActionArea-root:hover &': { opacity: 1 },
              transition: 'opacity 0.2s',
            }}
          >
            View
          </Box>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1,
            width: { md: '60%' },
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              mb: 0.5,
              transition: 'color 0.2s',
              '.MuiCardActionArea-root:hover &': { color: 'primary.main' },
            }}
          >
            {project.title}
          </Typography>

          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
            {project.shortSubtitle}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {project.summary}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
              Tech Stack:
            </Typography>
            <Box component="ul" sx={{ mt: 1, p: 0, m: 0, pl: 0, listStyle: 'none' }}>
              {techLines.slice(0, 4).map((line) => (
                <Box component="li" key={line}>
                  <Typography variant="caption" color="text.secondary">{line}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};
