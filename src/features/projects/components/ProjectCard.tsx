import React from 'react';
import { Link } from 'react-router-dom';
import { Project, MediaItem, TechStackGroup } from '@types';
import { Media } from './Media';
import { siteConfig } from '../../../../config/site';
import { M3 } from '../../../app/theme';
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

  // Fall back to first YouTube embed in mediaGallery if thumbnail isn't a YouTube URL
  const galleryYtId = !ytId
    ? (() => {
        const firstYt = project.mediaGallery?.find(
          (m: MediaItem) => m.type === 'iframe' && m.src && getYouTubeId(m.src)
        );
        return firstYt ? getYouTubeId(firstYt.src) : null;
      })()
    : null;

  const resolvedYtId = ytId ?? galleryYtId;

  const cardMedia: MediaItem =
    !thumbnailSrc || resolvedYtId
      ? project.featuredMedia.type === 'image'
        ? project.featuredMedia
        : { type: 'image', src: siteConfig.defaultOgImage, alt: `${project.title} preview` }
      : { type: 'image', src: thumbnailSrc, alt: `${project.title} thumbnail` };

  const handleClick = () => {
    // Save scroll position and current URL (with filters) before navigating to project
    sessionStorage.setItem('homepageScrollY', window.scrollY.toString());
    sessionStorage.setItem('homepageUrl', window.location.pathname + window.location.search);
  };

  return (
    <Box
      component={Link}
      to={`/projects/${project.slug}`}
      aria-label={project.title}
      onClick={handleClick}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        textDecoration: 'none',
        color: 'inherit',
        gap: { xs: 0, md: 2.5 },
        p: { xs: 1.5, md: 2 },
        borderRadius: '20px',
        bgcolor: project.isFeatured ? M3.surfaceContainer : M3.surfaceContainerLow,
        border: `1px solid ${project.isFeatured ? M3.primary + '50' : M3.outlineVariant}`,
        ...(project.isFeatured && {
          boxShadow: `0 0 20px ${M3.primary}15`,
        }),
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.05, 0.7, 0.1, 1)',
        '&:hover': {
          bgcolor: M3.surfaceContainerHigh,
          transform: 'translateY(-4px)',
          boxShadow: project.isFeatured
            ? `0 12px 40px rgba(0,0,0,0.3), 0 0 30px ${M3.primary}25`
            : `0 12px 40px rgba(0,0,0,0.3)`,
        },
        '&:hover .project-title': {
          color: M3.primary,
        },
        '&:hover .media-container': {
          transform: 'scale(1.02)',
        },
        '&:focus-visible': {
          outline: `2px solid ${M3.primary}`,
          outlineOffset: 4,
        },
      }}
    >
      {/* Media */}
      <Box
        className="media-container"
        sx={{
          position: 'relative',
          width: { xs: '100%', md: '40%' },
          aspectRatio: '16/10',
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '14px',
          bgcolor: M3.surfaceContainerHighest,
          mb: { xs: 1.5, md: 0 },
          transition: 'transform 0.25s cubic-bezier(0.05, 0.7, 0.1, 1)',
        }}
      >
        {resolvedYtId ? (
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${resolvedYtId}?autoplay=1&mute=1&loop=1&playlist=${resolvedYtId}&controls=0&playsinline=1&rel=0&modestbranding=1`}
            title={`${project.title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sx={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              pointerEvents: 'none', // prevent clicking into YouTube on the card
            }}
          />
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

        {/* Simple media overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${M3.primary}08 0%, transparent 60%)`,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }} />

        {/* Featured badge */}
        {project.isFeatured && (
          <Box sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: `linear-gradient(135deg, ${M3.primary}, ${M3.tertiary})`,
            color: M3.onPrimary,
            fontSize: '0.55rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            px: 1,
            py: 0.3,
            borderRadius: '6px',
            fontFamily: '"Space Grotesk", sans-serif',
            zIndex: 1,
          }}>
            Featured
          </Box>
        )}
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
            transition: 'color 0.2s ease-in-out',
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
          {(() => {
            // Handle both old format (array of objects with skills) and new format (simple array of strings)
            const skills = project.techStack.flatMap((item: TechStackGroup | string) => 
              typeof item === 'string' ? item : (item.skills || [])
            );
            return skills.slice(0, 3).map((skill: string) => (
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
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: M3.secondary,
                    color: M3.onSecondary,
                  },
                }}
              >
                {skill}
              </Typography>
            ));
          })()}
        </Box>
      </Box>
    </Box>
  );
};
