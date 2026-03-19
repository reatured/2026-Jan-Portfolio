import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Media } from './Media';
import { siteConfig } from '../../config/site';
import { M3 } from '../../theme';
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
    <Box
      component={Link}
      to={`/projects/${project.slug}`}
      aria-label={project.title}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        textDecoration: 'none',
        color: 'inherit',
        gap: { xs: 0, md: 2.5 },
        p: { xs: 1.5, md: 2 },
        borderRadius: '20px',
        bgcolor: M3.surfaceContainerLow,
        border: `1px solid ${M3.outlineVariant}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.28s var(--easing-emphasized)',
        // Gradient top accent on hover (always present, brightens on hover)
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
          opacity: 0,
          transition: 'opacity 0.25s var(--easing-emphasized)',
        },
        '&:hover::before': { opacity: 1 },
        '&:hover': {
          bgcolor: M3.surfaceContainerHigh,
          transform: 'translateY(-3px)',
          boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${M3.primary}25`,
        },
        '&:hover .project-title': {
          color: M3.primary,
        },
        '&:focus-visible': {
          outline: `2px solid ${M3.primary}`,
          outlineOffset: 4,
        },
      }}
    >
      {/* Media */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', md: '40%' },
          aspectRatio: '16/10',
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '14px',
          bgcolor: M3.surfaceContainerHighest,
          mb: { xs: 1.5, md: 0 },
        }}
      >
        {ytId ? (
          <>
            <Box
              component="img"
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={`${project.title} thumbnail`}
              loading="lazy"
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
                  width: 44, height: 44,
                  bgcolor: `${M3.primaryContainer}CC`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${M3.primary}60`,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={M3.onPrimaryContainer}>
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

        {/* Media shimmer overlay on hover */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${M3.primary}08 0%, transparent 60%)`,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }} />
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          py: { xs: 0, md: 0.5 },
          minWidth: 0,
        }}
      >
        <Typography
          className="project-title"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            mb: 0.5,
            color: M3.onSurface,
            fontFamily: '"Space Grotesk", sans-serif',
            transition: 'color 0.2s var(--easing-emphasized)',
            lineHeight: 1.25,
          }}
        >
          {project.title}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: M3.primary,
            mb: 1.25,
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {project.shortSubtitle}
        </Typography>

        <Typography
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.825rem',
            lineHeight: 1.55,
            mb: 1.5,
            color: M3.onSurfaceVariant,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {project.summary}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.techStack.slice(0, 3).flatMap(group =>
            group.skills.slice(0, 2).map(skill => (
              <Typography
                key={skill}
                component="span"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: M3.onSecondaryContainer,
                  bgcolor: M3.secondaryContainer,
                  px: 1.1,
                  py: 0.25,
                  borderRadius: '9999px',
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                {skill}
              </Typography>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};
