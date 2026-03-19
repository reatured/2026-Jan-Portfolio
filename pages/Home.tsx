import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Head } from '../lib/seo';
import { projects } from '../config/projects';
import { ProjectCard } from '../components/project/ProjectCard';
import { M3 } from '../theme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Decorative graphic header strip
const ProjectsHeader: React.FC = () => (
  <Box
    sx={{
      mb: 4,
      pb: 3,
      borderBottom: `1px solid ${M3.outlineVariant}`,
      position: 'relative',
      display: { xs: 'none', lg: 'block' },
    }}
  >
    {/* Eyebrow label */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      <Box sx={{
        width: 20, height: 2,
        background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
        borderRadius: 1,
      }} />
      <Typography
        sx={{
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: M3.primary,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        Selected Work
      </Typography>
    </Box>

    {/* Display headline */}
    <Typography
      sx={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: '2.5rem',
        lineHeight: 1.05,
        letterSpacing: '-0.025em',
        color: M3.onSurface,
        '& span': {
          background: `linear-gradient(135deg, ${M3.primary} 0%, ${M3.tertiary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      }}
    >
      Building at the edge of<br />
      <span>reality and code</span>
    </Typography>

    {/* Decorative floating shapes */}
    <Box aria-hidden sx={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'none' }}>
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <circle cx="100" cy="20" r="12" fill={M3.primaryContainer} fillOpacity="0.4" />
        <circle cx="80" cy="45" r="6" fill={M3.tertiaryContainer} fillOpacity="0.5" />
        <circle cx="110" cy="55" r="4" fill={M3.primary} fillOpacity="0.25" />
        <rect x="55" y="10" width="8" height="8" rx="2" fill={M3.primary} fillOpacity="0.2" transform="rotate(45 59 14)" />
      </svg>
    </Box>
  </Box>
);

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const filteredProjects = React.useMemo(() => {
    if (!currentCategory) return projects;
    return projects.filter(p => p.categories.includes(currentCategory));
  }, [currentCategory]);

  return (
    <Box
      sx={{
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeUp 0.4s var(--easing-emphasized-decelerate) both',
      }}
    >
      <Head title={currentCategory ? `${currentCategory} Projects` : "Home"} />

      {/* Mobile header */}
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
        <Typography
          sx={{
            fontSize: '1.75rem',
            fontFamily: '"Instrument Serif", Georgia, serif',
            color: M3.onSurface,
            mb: 0.5,
          }}
        >
          Projects
        </Typography>
      </Box>

      {/* Desktop header graphic */}
      {!currentCategory && <ProjectsHeader />}

      {/* Filter Status */}
      {currentCategory && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 16, height: 2,
            background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
            borderRadius: 1,
          }} />
          <Typography
            sx={{
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: M3.onSurfaceVariant,
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            Showing
          </Typography>
          <Typography
            sx={{
              fontSize: '0.825rem',
              fontWeight: 700,
              color: M3.primary,
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {currentCategory}
          </Typography>
        </Box>
      )}

      {/* Section meta */}
      <Box component="section" id="projects">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: M3.onSurfaceVariant,
              whiteSpace: 'nowrap',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {currentCategory
              ? `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`
              : `${projects.length} projects`}
          </Typography>
          <Box sx={{ height: '1px', bgcolor: M3.outlineVariant, flexGrow: 1, ml: 2, opacity: 0.5 }} />
        </Box>

        {filteredProjects.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {filteredProjects.map((project, i) => (
              <Box
                key={project.id}
                sx={{
                  '@keyframes cardFadeUp': {
                    from: { opacity: 0, transform: 'translateY(16px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  animation: `cardFadeUp 0.32s var(--easing-emphasized-decelerate) ${i * 35}ms both`,
                }}
              >
                <ProjectCard project={project} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontSize: '0.875rem', color: M3.onSurfaceVariant, fontFamily: '"Space Grotesk", sans-serif' }}>
              No projects found for this category.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
