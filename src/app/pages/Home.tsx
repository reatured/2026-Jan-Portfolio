import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Head } from '../../infrastructure/lib/seo';
import type { Project } from '@types';
import { ProjectCard } from '../../features/projects/components/ProjectCard';
import { M3 } from '../theme';
import { useProjects } from '../../infrastructure/api/hooks';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewStreamRoundedIcon from '@mui/icons-material/ViewStreamRounded';

type ViewMode = 'grid' | 'list';

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

const PLACEHOLDER_SRC = '/assets/cargo-import/page-4/Instagram-post---3.PNG';

const XHSCard: React.FC<{ project: Project; delay?: number }> = ({ project, delay = 0 }) => {
  const thumbnailSrc = project.thumbnail;
  const ytId = thumbnailSrc ? getYouTubeId(thumbnailSrc) : null;
  const galleryYtId = !ytId
    ? (() => {
        const firstYt = project.mediaGallery?.find(m => m.type === 'iframe' && m.src && getYouTubeId(m.src));
        return firstYt ? getYouTubeId(firstYt.src) : null;
      })()
    : null;
  const resolvedYtId = ytId ?? galleryYtId;

  const rawImgSrc = thumbnailSrc && !resolvedYtId
    ? thumbnailSrc
    : project.featuredMedia.type === 'image'
      ? project.featuredMedia.src
      : null;
  const imgSrc = rawImgSrc === PLACEHOLDER_SRC ? null : rawImgSrc;

  const handleClick = () => {
    sessionStorage.setItem('homepageScrollY', window.scrollY.toString());
    sessionStorage.setItem('homepageUrl', window.location.pathname + window.location.search);
  };

  return (
    <Box
      component={Link}
      to={`/projects/${project.slug}`}
      onClick={handleClick}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '16px',
        overflow: 'hidden',
        bgcolor: M3.surfaceContainerLow,
        border: `1px solid ${M3.outlineVariant}44`,
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        '@keyframes xhsFadeUp': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: `xhsFadeUp 0.35s cubic-bezier(0.05, 0.7, 0.1, 1) ${delay}ms both`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.26)',
        },
        '&:hover .xhs-thumb': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: M3.surfaceContainerHighest,
        }}
      >
        {resolvedYtId ? (
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${resolvedYtId}?autoplay=1&mute=1&loop=1&playlist=${resolvedYtId}&controls=0&playsinline=1&rel=0&modestbranding=1`}
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sx={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'none' }}
          />
        ) : imgSrc ? (
          <Box
            className="xhs-thumb"
            component="img"
            src={imgSrc}
            alt={project.title}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s cubic-bezier(0.05, 0.7, 0.1, 1)',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${M3.surfaceContainerHighest} 0%, ${M3.surfaceContainer} 100%)`,
              p: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: M3.onSurfaceVariant,
                fontFamily: '"Space Grotesk", sans-serif',
                textAlign: 'center',
                opacity: 0.45,
                letterSpacing: '0.02em',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.title}
            </Typography>
          </Box>
        )}

        {/* Category pill */}
        {project.categories[0] && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(10,8,18,0.62)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '0.55rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              px: 1,
              py: 0.35,
              borderRadius: '8px',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {project.categories[0]}
          </Box>
        )}
      </Box>

      {/* Text */}
      <Box sx={{ p: { xs: 1.25, md: 1.5 } }}>
        <Typography
          sx={{
            fontSize: { xs: '0.82rem', md: '0.875rem' },
            fontWeight: 700,
            letterSpacing: '-0.015em',
            color: M3.onSurface,
            fontFamily: '"Space Grotesk", sans-serif',
            lineHeight: 1.3,
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.title}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.7rem',
            color: M3.onSurfaceVariant,
            fontFamily: '"Space Grotesk", sans-serif',
            lineHeight: 1.45,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.shortSubtitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          {project.year && (
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: M3.onSurfaceVariant,
                fontFamily: '"Space Grotesk", sans-serif',
                opacity: 0.6,
                mr: 0.25,
              }}
            >
              {project.year}
            </Typography>
          )}
          {project.rolesOrSkills.slice(0, 2).map(skill => (
            <Typography
              key={skill}
              component="span"
              sx={{
                fontSize: '0.58rem',
                fontWeight: 600,
                color: M3.onSecondaryContainer,
                bgcolor: M3.secondaryContainer,
                px: 0.75,
                py: 0.2,
                borderRadius: '9999px',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {skill}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Enhanced decorative graphic header strip
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, position: 'relative', zIndex: 1 }}>
      <Box sx={{
        width: 24, height: 3,
        background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
        borderRadius: 2,
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
        Engineering Portfolio
      </Typography>
    </Box>

    {/* Display headline */}
    <Typography
      sx={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: '3rem',
        lineHeight: 1.05,
        letterSpacing: '-0.025em',
        color: M3.onSurface,
        position: 'relative',
        zIndex: 1,
        '& span': {
          background: `linear-gradient(135deg, ${M3.primary} 0%, ${M3.tertiary} 50%, ${M3.secondary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      }}
    >
      Building at the edge of<br />
      <span>perception and actuation</span>
    </Typography>

    {/* Simple decorative shapes */}
    <Box aria-hidden sx={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'none' }}>
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <circle cx="100" cy="20" r="12" fill={M3.primaryContainer} fillOpacity="0.4" />
        <circle cx="80" cy="45" r="6" fill={M3.tertiaryContainer} fillOpacity="0.5" />
        <circle cx="110" cy="55" r="4" fill={M3.primary} fillOpacity="0.3" />
        <rect x="55" y="10" width="8" height="8" rx="2" fill={M3.primary} fillOpacity="0.2" transform="rotate(45 59 14)" />
      </svg>
    </Box>
  </Box>
);

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try { return (localStorage.getItem('portfolioViewMode') as ViewMode) || 'grid'; }
    catch { return 'grid'; }
  });
  const { data: projects = [], isLoading, error } = useProjects();

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try { localStorage.setItem('portfolioViewMode', mode); } catch { /* */ }
  };

  // Restore scroll position after projects have loaded
  useLayoutEffect(() => {
    if (isLoading) return;

    const savedY = sessionStorage.getItem('homepageScrollY');
    if (!savedY) return;

    const position = parseInt(savedY, 10);
    if (position <= 0) {
      sessionStorage.removeItem('homepageScrollY');
      return;
    }

    // Immediate scroll before paint
    window.scrollTo({ top: position, behavior: 'instant' });

    // Retry via rAF until page is tall enough or timeout
    let rafId: number;
    let attempts = 0;
    const MAX_ATTEMPTS = 120; // ~2s at 60fps

    const tryScroll = () => {
      window.scrollTo({ top: position, behavior: 'instant' });
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollable < position && attempts < MAX_ATTEMPTS) {
        attempts++;
        rafId = requestAnimationFrame(tryScroll);
      } else {
        sessionStorage.removeItem('homepageScrollY');
      }
    };

    rafId = requestAnimationFrame(tryScroll);

    return () => {
      cancelAnimationFrame(rafId);
      // Don't remove sessionStorage here — StrictMode re-mount needs it
    };
  }, [isLoading]);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        const newParams = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
          newParams.set('search', searchInput.trim());
        } else {
          newParams.delete('search');
        }
        setSearchParams(newParams);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, searchParams, setSearchParams]);

  // Update input when URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(p => !p.hidden);

    // Filter by category
    if (currentCategory) {
      filtered = filtered.filter(p => p.categories.includes(currentCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.shortSubtitle.toLowerCase().includes(query) ||
        p.categories.some(cat => cat.toLowerCase().includes(query)) ||
        p.rolesOrSkills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [currentCategory, searchQuery, projects]);

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Failed to load projects</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeUp 0.4s cubic-bezier(0.05, 0.7, 0.1, 1) both',
        position: 'relative',
      }}
    >
      <Head title={currentCategory ? `${currentCategory} Projects` : "Home"} />

      {/* Enhanced mobile header */}
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3, position: 'relative', zIndex: 1 }}>
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

      {/* Search Bar */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
        <TextField
          fullWidth
          placeholder="Search projects..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: M3.surfaceContainerLow,
              borderRadius: '12px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: M3.surfaceContainer,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: M3.primary,
                },
              },
              '&.Mui-focused': {
                bgcolor: M3.surfaceContainer,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: M3.primary,
                  borderWidth: 2,
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: M3.outlineVariant,
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              fontFamily: '"Space Grotesk", sans-serif',
              py: 1.25,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: M3.onSurfaceVariant, fontSize: '1.25rem' }} />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchInput('')}
                  size="small"
                  sx={{
                    color: M3.onSurfaceVariant,
                    '&:hover': {
                      color: M3.onSurface,
                      bgcolor: `${M3.onSurface}10`,
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Filter status */}
      {(currentCategory || searchQuery) && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 20, height: 3,
            background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
            borderRadius: 2,
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
          {currentCategory && (
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
          )}
          {currentCategory && searchQuery && (
            <Typography
              sx={{
                fontSize: '0.825rem',
                color: M3.onSurfaceVariant,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              +
            </Typography>
          )}
          {searchQuery && (
            <Typography
              sx={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: M3.primary,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              "{searchQuery}"
            </Typography>
          )}
        </Box>
      )}

      {/* Section meta */}
      <Box component="section" id="projects">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
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
          <Box sx={{ height: '1px', bgcolor: M3.outlineVariant, flexGrow: 1, opacity: 0.5 }} />

          {/* View toggle */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.25,
              bgcolor: M3.surfaceContainerLow,
              borderRadius: '10px',
              p: 0.4,
              border: `1px solid ${M3.outlineVariant}44`,
              flexShrink: 0,
            }}
          >
            {([
              { mode: 'grid' as ViewMode, icon: <GridViewRoundedIcon sx={{ fontSize: '1rem' }} />, label: 'Grid view' },
              { mode: 'list' as ViewMode, icon: <ViewStreamRoundedIcon sx={{ fontSize: '1rem' }} />, label: 'List view' },
            ]).map(({ mode, icon, label }) => (
              <Tooltip key={mode} title={label} placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleViewMode(mode)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '7px',
                    color: viewMode === mode ? M3.onPrimaryContainer : M3.onSurfaceVariant,
                    bgcolor: viewMode === mode ? M3.primaryContainer : 'transparent',
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: viewMode === mode ? M3.primaryContainer : `${M3.onSurface}10`,
                    },
                  }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {filteredProjects.length > 0 ? (
          viewMode === 'grid' ? (
          <Box
            sx={{
              columns: { xs: 2, lg: 3 },
              columnGap: { xs: '10px', md: '14px' },
              position: 'relative',
              zIndex: 1,
            }}
          >
            {filteredProjects.map((project, i) => (
              <Box
                key={project.id}
                sx={{ breakInside: 'avoid', mb: { xs: '10px', md: '14px' } }}
              >
                <XHSCard project={project} delay={Math.min(i * 35, 280)} />
              </Box>
            ))}
          </Box>
          ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative', zIndex: 1 }}>
            {filteredProjects.map((project, i) => (
              <Box
                key={project.id}
                sx={{
                  '@keyframes cardFadeUp': {
                    from: { opacity: 0, transform: 'translateY(14px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  animation: `cardFadeUp 0.3s cubic-bezier(0.05, 0.7, 0.1, 1) ${Math.min(i * 40, 280)}ms both`,
                }}
              >
                <ProjectCard project={project} />
              </Box>
            ))}
          </Box>
          )
        ) : (
          <Box sx={{ textAlign: 'center', py: 12, position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontSize: '0.875rem', color: M3.onSurfaceVariant, fontFamily: '"Space Grotesk", sans-serif' }}>
              {searchQuery
                ? `No projects found matching "${searchQuery}"${currentCategory ? ` in ${currentCategory}` : ''}.`
                : 'No projects found for this category.'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
