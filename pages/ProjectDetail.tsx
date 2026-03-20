import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { projects } from '../config/projects';
import { Head, generateJsonLd } from '../lib/seo';
import { Media } from '../components/project/Media';
import { M3 } from '../theme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const MetaCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      bgcolor: M3.surfaceContainerLow,
      borderRadius: '16px',
      p: 2,
      border: `1px solid ${M3.outlineVariant}30`,
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

const InfoPanel: React.FC<{ project: (typeof projects)[number] }> = ({ project }) => {
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
      {project.techStack.length > 0 && (
        <MetaCard>
          <MetaLabel>Stack</MetaLabel>
          <Stack spacing={1.5}>
            {(() => {
              // Handle both old format (array of objects with skills) and new format (simple array of strings)
              const hasOldFormat = project.techStack.some(item => typeof item === 'object' && item.skills);
              
              if (hasOldFormat) {
                // Old format: array of objects with category and skills
                return project.techStack.map((group) => (
                  <Box key={group.category}>
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: M3.onSurfaceVariant,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        mb: 0.75,
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      {group.category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {group.skills.map(skill => (
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
              </Box>
                ));
              } else {
                // New format: simple array of strings
                return (
                  <Box key="tech-stack-new-format" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {project.techStack.map((skill) => (
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
                );
              }
            })()}
          </Stack>
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

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const project = useMemo(() => {
    return projects.find(p => p.slug === slug);
  }, [slug]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const jsonLd = generateJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.summary
  });

  return (
    <Box
      component="article"
      sx={{
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeUp 0.4s var(--easing-emphasized-decelerate) both',
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

      {/* Header */}
      <Box component="header" sx={{ mb: 5, position: 'relative' }}>
        {/* Eyebrow gradient bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{
            width: 24, height: 2,
            background: `linear-gradient(90deg, ${M3.primary}, ${M3.tertiary})`,
            borderRadius: 1,
          }} />
          <Typography sx={{
            fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.16em', color: M3.primary, fontFamily: '"Space Grotesk", sans-serif',
          }}>
            Project
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            mb: 1.5,
            fontSize: { xs: '2.25rem', md: '3.25rem' },
            color: M3.onSurface,
          }}
        >
          {project.title}
        </Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            color: M3.onSurfaceVariant,
            lineHeight: 1.6,
            maxWidth: 600,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {project.shortSubtitle}
        </Typography>

        {/* Decorative corner SVG */}
        <Box aria-hidden sx={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'none', display: { xs: 'none', md: 'block' } }}>
          <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
            <circle cx="85" cy="15" r="14" fill={M3.primaryContainer} fillOpacity="0.35" />
            <circle cx="65" cy="40" r="7" fill={M3.tertiaryContainer} fillOpacity="0.45" />
            <circle cx="92" cy="50" r="4" fill={M3.primary} fillOpacity="0.2" />
            <rect x="42" y="8" width="7" height="7" rx="1.5" fill={M3.primary} fillOpacity="0.18" transform="rotate(45 46 12)" />
          </svg>
        </Box>
      </Box>

      {/* Hero Media */}
      <Box
        sx={{
          mb: 5,
          borderRadius: '28px',
          overflow: 'hidden',
          bgcolor: M3.surfaceContainerHighest,
          boxShadow: `0 2px 16px rgba(0,0,0,0.3)`,
        }}
      >
        <Media
          item={project.featuredMedia}
          className={`w-full ${project.featuredMedia.type !== 'iframe' ? 'aspect-video' : ''}`}
        />
      </Box>

      {/* Two-column: body + info */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 280px' },
          gap: { xs: 5, lg: 6 },
          alignItems: 'start',
        }}
      >
        {/* Body */}
        <Box>
          {project.content ? (
            <Box
              className="prose"
              sx={{ color: M3.onSurfaceVariant }}
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          ) : project.mediaGallery.length > 0 ? (
            <Box component="section">
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
                Gallery
              </Typography>
              <Stack spacing={2}>
                {project.mediaGallery.map((media, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      bgcolor: M3.surfaceContainerHighest,
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
              </Stack>
            </Box>
          ) : (
            <Typography
              sx={{
                lineHeight: 1.75,
                color: M3.onSurfaceVariant,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {project.summary}
            </Typography>
          )}

          {/* Mobile info panel */}
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

        {/* Desktop sticky info panel */}
        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 32 },
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <InfoPanel project={project} />
        </Box>
      </Box>
    </Box>
  );
};
