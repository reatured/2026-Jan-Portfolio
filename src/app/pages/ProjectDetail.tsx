import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { Project } from '@types';
import { Head, generateJsonLd } from '../../infrastructure/lib/seo';
import { Media } from '../../features/projects/components/Media';
import { M3 } from '../theme';
import { useProject } from '../../infrastructure/api/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

const getStackItems = (project: Project) => {
  const items = project.techStack.flatMap((entry) => {
    if (typeof entry === 'string') {
      return [entry];
    }

    if (Array.isArray(entry.skills)) {
      return entry.skills;
    }

    return [];
  });

  return [...new Set(items)];
};

const MetaCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      bgcolor: `${M3.surfaceContainerLow}E6`,
      borderRadius: '22px',
      p: 2.25,
      border: `1px solid ${M3.outlineVariant}55`,
      boxShadow: '0 18px 36px rgba(0, 0, 0, 0.18)',
      backdropFilter: 'blur(18px)',
    }}
  >
    {children}
  </Box>
);

const MetaLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    sx={{
      fontSize: '0.6rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: M3.onSurfaceVariant,
      mb: 1,
      fontFamily: '"Space Grotesk", sans-serif',
    }}
  >
    {children}
  </Typography>
);

const InfoPanel: React.FC<{ project: Project }> = ({ project }) => {
  const stackItems = getStackItems(project);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Year + Status */}
      {(project.year || project.status) && (
        <MetaCard>
          <MetaLabel>Timeline</MetaLabel>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'baseline' }}>
            {project.year && (
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: M3.onSurface,
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {project.year}
              </Typography>
            )}
            {project.status && (
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: M3.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {project.status}
              </Typography>
            )}
          </Box>
        </MetaCard>
      )}

      {/* Roles */}
      {project.rolesOrSkills.length > 0 && (
        <MetaCard>
          <MetaLabel>Role</MetaLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {project.rolesOrSkills.map(role => (
              <Typography
                key={role}
                component="span"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: M3.onPrimaryContainer,
                  bgcolor: M3.primaryContainer,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: '9999px',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {role}
              </Typography>
            ))}
          </Box>
        </MetaCard>
      )}

      {/* Tech Stack */}
      {stackItems.length > 0 && (
        <MetaCard>
          <MetaLabel>Stack</MetaLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {stackItems.map(skill => (
              <Typography
                key={skill}
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: M3.onSecondaryContainer,
                  bgcolor: M3.secondaryContainer,
                  px: 1,
                  py: 0.375,
                  borderRadius: '9999px',
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {skill}
              </Typography>
            ))}
          </Box>
        </MetaCard>
      )}

      {/* Links */}
      {project.links && project.links.length > 0 && (
        <MetaCard>
          <MetaLabel>Links</MetaLabel>
          <Stack spacing={0.5}>
            {project.links.map((link) => (
              <Box
                key={link.url}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 0.75,
                  px: 1,
                  textDecoration: 'none',
                  color: M3.onSurface,
                  borderRadius: '10px',
                  transition: 'all 0.2s var(--easing-emphasized)',
                  '&:hover': { color: M3.primary, bgcolor: M3.surfaceContainerHigh },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {link.label}
                </Typography>
                <OpenInNewIcon sx={{ fontSize: '0.8rem', color: 'inherit' }} />
              </Box>
            ))}
          </Stack>
        </MetaCard>
      )}
    </Box>
  );
};

const FactChip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box
    sx={{
      minWidth: 0,
      borderRadius: '18px',
      border: `1px solid ${M3.outlineVariant}55`,
      bgcolor: `${M3.surfaceContainerLow}CC`,
      px: 1.5,
      py: 1.25,
      backdropFilter: 'blur(14px)',
    }}
  >
    <Typography
      sx={{
        fontSize: '0.62rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: M3.onSurfaceVariant,
        mb: 0.55,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: '0.95rem',
        color: M3.onSurface,
        lineHeight: 1.4,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {value}
    </Typography>
  </Box>
);

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProject(slug || '');
  const [activeModalMediaIndex, setActiveModalMediaIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading project...</Typography>
      </Box>
    );
  }

  if (error || !project) {
    return <Navigate to="/" replace />;
  }

  const jsonLd = generateJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.summary
  });

  const stackItems = getStackItems(project);
  const modalGalleryItems = project.mediaGallery.filter(item => item.presentation === 'modal');
  const galleryItems = project.mediaGallery.filter((item) => {
    const isDuplicateFeatured = item.src === project.featuredMedia.src && item.type === project.featuredMedia.type;
    return !isDuplicateFeatured && item.presentation !== 'modal';
  });
  const isGalleryHeavyProject = galleryItems.length >= 6;
  const highlightGalleryItems = isGalleryHeavyProject ? galleryItems.slice(0, 4) : [];
  const remainingGalleryItems = isGalleryHeavyProject ? galleryItems.slice(4) : galleryItems;
  const activeModalMedia = activeModalMediaIndex !== null ? modalGalleryItems[activeModalMediaIndex] : null;
  const liveInteractionLink = project.links.find(link => /live|play|try|demo/i.test(link.label));

  return (
    <Box
      component="article"
      sx={{
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeUp 0.4s var(--easing-emphasized-decelerate) both',
        position: 'relative',
      }}
    >
      <Head
        title={project.title}
        description={project.shortSubtitle}
        image={project.featuredMedia.type === 'image' ? project.featuredMedia.src : undefined}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />

      {/* Back */}
      <Button
        href="/"
        component="a"
        startIcon={<ArrowBackIcon sx={{ fontSize: '0.8rem !important' }} />}
        size="small"
        sx={{
          mb: 4,
          color: M3.onSurfaceVariant,
          fontWeight: 600,
          fontSize: '0.8rem',
          borderRadius: '10px',
          px: 1.5,
          bgcolor: M3.surfaceContainerLow,
          fontFamily: '"Space Grotesk", sans-serif',
          border: `1px solid ${M3.outlineVariant}30`,
          transition: 'all 0.2s var(--easing-emphasized)',
          '&:hover': {
            color: M3.primary,
            bgcolor: M3.surfaceContainerHigh,
          },
        }}
      >
        Back
      </Button>

      <Box
        component="header"
        sx={{
          mb: { xs: 5, lg: 6 },
          position: 'relative',
          borderRadius: { xs: '28px', lg: '34px' },
          overflow: 'hidden',
          border: `1px solid ${M3.outlineVariant}55`,
          background: `
            radial-gradient(circle at top right, ${M3.primaryContainer}66 0%, transparent 34%),
            radial-gradient(circle at bottom left, ${M3.tertiaryContainer}55 0%, transparent 30%),
            linear-gradient(180deg, ${M3.surfaceContainer} 0%, ${M3.surfaceContainerLow} 100%)
          `,
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.32)',
          px: { xs: 2, md: 3, lg: 4 },
          py: { xs: 2, md: 3, lg: 4 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)' },
            gap: { xs: 3, lg: 4 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.75 }}>
              <Box sx={{
                width: 28,
                height: 3,
                background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
                borderRadius: 999,
              }} />
              <Typography sx={{
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: M3.primary,
                fontFamily: '"Space Grotesk", sans-serif',
              }}>
                Project Case Study
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                mb: 1.5,
                fontSize: { xs: '2.6rem', md: '4rem', lg: '4.65rem' },
                color: M3.onSurface,
                maxWidth: { xl: '12ch' },
              }}
            >
              {project.title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: M3.onSurfaceVariant,
                lineHeight: 1.75,
                maxWidth: '60ch',
                fontFamily: '"Space Grotesk", sans-serif',
                mb: 3,
              }}
            >
              {project.shortSubtitle || project.summary}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' },
                gap: 1.25,
                maxWidth: 860,
              }}
            >
              {project.year && <FactChip label="Year" value={project.year} />}
              {project.status && <FactChip label="Status" value={project.status} />}
              {project.rolesOrSkills.length > 0 && (
                <FactChip label="Role" value={project.rolesOrSkills.slice(0, 2).join(' / ')} />
              )}
              <FactChip
                label="Stack"
                value={stackItems.length > 0 ? stackItems.slice(0, 3).join(' / ') : 'Project build'}
              />
            </Box>
          </Box>

          <Box
            sx={{
              minWidth: 0,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                borderRadius: '28px',
                overflow: 'hidden',
                bgcolor: M3.surfaceContainerHighest,
                border: `1px solid ${M3.outlineVariant}40`,
                boxShadow: '0 22px 50px rgba(0, 0, 0, 0.28)',
              }}
            >
              <Media
                item={project.featuredMedia}
                className={`w-full ${project.featuredMedia.type !== 'iframe' ? 'aspect-video' : ''}`}
              />
            </Box>
          </Box>
        </Box>

        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, transparent 0%, rgba(10, 8, 18, 0.1) 100%)',
          }}
        />
      </Box>

      {modalGalleryItems.length > 0 && (
        <Box
          component="section"
          sx={{
            position: 'relative',
            mt: { xs: 4, lg: 5 },
            mb: { xs: 5, lg: 6 },
            px: { xs: 0, md: 0 },
            py: 0,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: { xs: '26px', md: '32px' },
              border: `1px solid ${M3.outlineVariant}50`,
              background: `
                radial-gradient(circle at top right, ${M3.primaryContainer}52 0%, transparent 30%),
                radial-gradient(circle at bottom left, ${M3.tertiaryContainer}40 0%, transparent 28%),
                linear-gradient(180deg, ${M3.surfaceContainerLow}F2 0%, ${M3.surfaceContainer}F4 100%)
              `,
              boxShadow: '0 28px 70px rgba(0, 0, 0, 0.22)',
              p: { xs: 2.25, md: 3, lg: 3.5 },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)' },
                gap: { xs: 2.5, lg: 3.5 },
                alignItems: 'stretch',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: M3.primary,
                    mb: 0.75,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {modalGalleryItems[0]?.label || 'Interactive Demo'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontSize: { xs: '2rem', md: '2.6rem' },
                    lineHeight: 1.02,
                    color: M3.onSurface,
                    maxWidth: '14ch',
                    mb: 1.25,
                  }}
                >
                  Open the live simulation in a near-fullscreen workspace.
                </Typography>
                <Typography
                  sx={{
                    maxWidth: '58ch',
                    fontSize: '0.98rem',
                    lineHeight: 1.8,
                    color: M3.onSurfaceVariant,
                    fontFamily: '"Space Grotesk", sans-serif',
                    mb: 2.5,
                  }}
                >
                  Keep the case study clean in-page, then launch the interactive prototype when you
                  actually want room to explore it. This avoids crushing the article layout while
                  still giving the simulation the space it needs.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowRoundedIcon />}
                    onClick={() => setActiveModalMediaIndex(0)}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, px: 2.5, py: 1.2 }}
                  >
                    Launch Interaction
                  </Button>
                  {liveInteractionLink && (
                    <Button
                      component="a"
                      href={liveInteractionLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      endIcon={<OpenInNewIcon />}
                      sx={{
                        alignSelf: { xs: 'stretch', sm: 'flex-start' },
                        px: 2.25,
                        py: 1.2,
                        borderColor: `${M3.outlineVariant}CC`,
                        color: M3.onSurface,
                      }}
                    >
                      Open in New Tab
                    </Button>
                  )}
                </Stack>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  minHeight: { xs: 240, md: 320 },
                  borderRadius: { xs: '22px', md: '28px' },
                  overflow: 'hidden',
                  border: `1px solid ${M3.outlineVariant}45`,
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.24)',
                  background: `
                    linear-gradient(180deg, rgba(12, 10, 20, 0.2) 0%, rgba(12, 10, 20, 0.72) 100%),
                    radial-gradient(circle at top right, ${M3.primaryContainer}80 0%, transparent 42%),
                    linear-gradient(135deg, ${M3.surfaceContainerHighest} 0%, ${M3.surfaceContainerLow} 100%)
                  `,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                      linear-gradient(0deg, rgba(12, 10, 20, 0.82), rgba(12, 10, 20, 0.18)),
                      radial-gradient(circle at 20% 20%, rgba(208, 188, 255, 0.2), transparent 30%)
                    `,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: { xs: 'auto 18px 18px 18px', md: 'auto 24px 24px 24px' },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    zIndex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: M3.primary,
                      fontFamily: '"Space Grotesk", sans-serif',
                    }}
                  >
                    Interactive Preview
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '1.2rem', md: '1.45rem' },
                      color: M3.onSurface,
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      maxWidth: '18ch',
                    }}
                  >
                    Camera-enabled robotic hand teleoperation in the browser.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 18, md: 24 },
                    right: { xs: 18, md: 24 },
                    zIndex: 1,
                    width: { xs: 58, md: 72 },
                    height: { xs: 58, md: 72 },
                    borderRadius: '999px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(12, 10, 20, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 14px 28px rgba(0, 0, 0, 0.28)',
                    backdropFilter: 'blur(18px)',
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ fontSize: { xs: 28, md: 34 }, color: M3.onSurface }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {highlightGalleryItems.length > 0 && (
        <Box
          component="section"
          sx={{
            mt: { xs: 4, lg: 5 },
            mb: { xs: 5, lg: 6 },
            borderRadius: { xs: '24px', md: '30px' },
            border: `1px solid ${M3.outlineVariant}45`,
            bgcolor: `${M3.surfaceContainerLow}B8`,
            p: { xs: 2.25, md: 3, lg: 3.5 },
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.18)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: M3.primary,
                  mb: 0.75,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                Visual Highlights
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: { xs: '1.9rem', md: '2.5rem' },
                  lineHeight: 1.04,
                  color: M3.onSurface,
                }}
              >
                A quicker visual read before the full case study.
              </Typography>
            </Box>
            <Typography
              sx={{
                maxWidth: 420,
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: M3.onSurfaceVariant,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Gallery-heavy projects get a dedicated visual lead-in so the page does not bury the
              strongest work under a long article.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr', xl: '1.3fr 0.7fr' },
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                borderRadius: { xs: '22px', md: '28px' },
                overflow: 'hidden',
                bgcolor: M3.surfaceContainerHighest,
              }}
            >
              <Media item={highlightGalleryItems[0]} className="w-full" />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr' },
                gap: 1.5,
              }}
            >
              {highlightGalleryItems.slice(1).map((media, idx) => (
                <Box
                  key={`${media.src}-${idx}`}
                  sx={{
                    minWidth: 0,
                    borderRadius: '22px',
                    overflow: 'hidden',
                    bgcolor: M3.surfaceContainerHighest,
                  }}
                >
                  <Media item={media} className="w-full" />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
          gap: { xs: 5, lg: 4 },
          alignItems: 'start',
        }}
      >
        <Box>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: { xs: '26px', md: '30px' },
              border: `1px solid ${M3.outlineVariant}50`,
              bgcolor: `${M3.surfaceContainerLow}CC`,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.22)',
              backdropFilter: 'blur(20px)',
              p: { xs: 2.25, md: 3.25, lg: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box sx={{
                width: 24,
                height: 2,
                background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
                borderRadius: 999,
              }} />
              <Typography
                sx={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: M3.onSurfaceVariant,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                Inside the Project
              </Typography>
            </Box>

            {project.content ? (
              <Box
                className="prose"
                sx={{
                  color: M3.onSurfaceVariant,
                  maxWidth: 'none',
                  '& [class]': {
                    maxWidth: '100%',
                  },
                  '& section': {
                    display: 'grid',
                    gap: 1.1,
                  },
                  '& section + section': {
                    mt: { xs: 4, md: 5 },
                    pt: { xs: 3, md: 4 },
                    borderTop: `1px solid ${M3.outlineVariant}55`,
                  },
                  '& h2:first-of-type': {
                    mt: 0,
                  },
                  '& h2': {
                    fontSize: { xs: '1.6rem', md: '2rem' },
                  },
                  '& h3': {
                    fontSize: { xs: '1.18rem', md: '1.4rem' },
                    color: M3.onSurface,
                  },
                  '& p': {
                    fontSize: { xs: '0.98rem', md: '1.02rem' },
                    lineHeight: 1.9,
                    color: M3.onSurfaceVariant,
                  },
                  '& ul, & ol': {
                    display: 'grid',
                    gap: 0.8,
                    pl: 2.2,
                  },
                  '& li::marker': {
                    color: M3.primary,
                  },
                  '& figure, & img, & video, & iframe': {
                    width: '100%',
                    maxWidth: '100%',
                  },
                  '& img, & video, & iframe': {
                    borderRadius: '24px',
                    border: `1px solid ${M3.outlineVariant}30`,
                    backgroundColor: M3.surfaceContainer,
                  },
                  '& a': {
                    color: M3.primary,
                  },
                  '& strong': {
                    color: M3.onSurface,
                  },
                  '& blockquote': {
                    m: 0,
                    p: 2,
                    borderRadius: '20px',
                    borderLeft: `3px solid ${M3.primary}`,
                    bgcolor: `${M3.surfaceContainer}CC`,
                  },
                  '& .project-fact-grid': {
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                    gap: 1.25,
                    my: 2,
                  },
                  '& .project-fact': {
                    p: 1.5,
                    borderRadius: '18px',
                    border: `1px solid ${M3.outlineVariant}40`,
                    bgcolor: `${M3.surfaceContainer}CC`,
                  },
                  '& .project-fact strong': {
                    display: 'block',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: M3.onSurfaceVariant,
                    mb: 0.5,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <Typography
                sx={{
                  lineHeight: 1.85,
                  color: M3.onSurfaceVariant,
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '1rem',
                }}
              >
                {project.summary}
              </Typography>
            )}
          </Box>

          {remainingGalleryItems.length > 0 && (
            <Box
              component="section"
              sx={{
                mt: 4,
                borderRadius: { xs: '24px', md: '28px' },
                border: `1px solid ${M3.outlineVariant}45`,
                bgcolor: `${M3.surfaceContainerLow}B3`,
                p: { xs: 2.25, md: 3 },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: M3.onSurfaceVariant,
                  mb: 2,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {isGalleryHeavyProject ? 'Full Gallery' : 'Gallery'}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isGalleryHeavyProject
                    ? { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }
                    : remainingGalleryItems.length > 1
                      ? { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }
                      : '1fr',
                  gap: 2,
                }}
              >
                {remainingGalleryItems.map((media, idx) => (
                  <Box
                    key={`${media.src}-${idx}`}
                    sx={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      bgcolor: M3.surfaceContainerHighest,
                      display: 'grid',
                      alignContent: 'start',
                    }}
                  >
                    <Media item={media} className="w-full" />
                    {media.alt && (
                      <Box sx={{ p: 1.5 }}>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: M3.onSurfaceVariant,
                            fontFamily: '"Space Grotesk", sans-serif',
                          }}
                        >
                          {media.alt}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: { xs: 'block', lg: 'none' },
              mt: 5,
              pt: 4,
              borderTop: `1px solid ${M3.outlineVariant}`,
            }}
          >
            <InfoPanel project={project} />
          </Box>
        </Box>

        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 120 },
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <InfoPanel project={project} />
        </Box>
      </Box>

      <Dialog
        open={!!activeModalMedia}
        onClose={() => setActiveModalMediaIndex(null)}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 'min(96vw, 1680px)',
            height: 'min(92vh, 980px)',
            maxWidth: 'none',
            m: 0,
            borderRadius: { xs: '20px', md: '28px' },
            overflow: 'hidden',
            background: `
              radial-gradient(circle at top right, ${M3.primaryContainer}55 0%, transparent 28%),
              linear-gradient(180deg, ${M3.surfaceContainer} 0%, ${M3.surfaceContainerLow} 100%)
            `,
            border: `1px solid ${M3.outlineVariant}66`,
            boxShadow: '0 32px 120px rgba(0, 0, 0, 0.52)',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(3, 3, 7, 0.72)',
            },
          },
        }}
      >
        {activeModalMedia && (
          <Box sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
                borderBottom: `1px solid ${M3.outlineVariant}55`,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: M3.primary,
                    fontFamily: '"Space Grotesk", sans-serif',
                    mb: 0.5,
                  }}
                >
                  {activeModalMedia.label || 'Interactive Demo'}
                </Typography>
                <Typography
                  sx={{
                    color: M3.onSurface,
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: { xs: '1rem', md: '1.05rem' },
                    fontWeight: 500,
                  }}
                >
                  {activeModalMedia.alt || 'Explore the project in a near-fullscreen view.'}
                </Typography>
              </Box>
              <IconButton
                onClick={() => setActiveModalMediaIndex(null)}
                aria-label="Close interaction"
                sx={{
                  color: M3.onSurface,
                  bgcolor: `${M3.surfaceContainerHighest}CC`,
                  border: `1px solid ${M3.outlineVariant}55`,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ minHeight: 0, p: { xs: 1.5, md: 2 } }}>
              <Box
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: { xs: '16px', md: '22px' },
                  border: `1px solid ${M3.outlineVariant}55`,
                  bgcolor: M3.surfaceContainerHighest,
                }}
              >
                <Box
                  component="iframe"
                  src={activeModalMedia.src}
                  title={activeModalMedia.title || activeModalMedia.alt || 'Interactive Content'}
                  allow={
                    activeModalMedia.allow ||
                    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  }
                  allowFullScreen
                  sx={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                    display: 'block',
                    bgcolor: M3.surfaceContainerHighest,
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
