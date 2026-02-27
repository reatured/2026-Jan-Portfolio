import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { projects } from '../config/projects';
import { Head, generateJsonLd } from '../lib/seo';
import { Media } from '../components/project/Media';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
        '@keyframes fadeSlideIn': {
          from: { opacity: 0, transform: 'translateY(32px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeSlideIn 0.5s ease both',
      }}
    >
      <Head
        title={project.title}
        description={project.shortSubtitle}
        image={project.featuredMedia.src}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />

      {/* Two-column page layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
          gap: { xs: 4, lg: 5 },
          alignItems: 'start',
        }}
      >
        {/* ── Left: main content ── */}
        <Box>
          {/* Back button */}
          <Button
            href="/"
            component="a"
            startIcon={<ArrowBackIcon sx={{ fontSize: '0.875rem !important' }} />}
            size="small"
            sx={{
              mb: 3, color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem',
              '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
              pl: 0,
            }}
          >
            Back to Projects
          </Button>

          {/* Header */}
          <Box component="header" sx={{ mb: 3 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{ mb: 1, letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              {project.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {project.shortSubtitle}
            </Typography>
          </Box>

          {/* Featured Media */}
          <Box
            sx={{
              mb: 4, borderRadius: 3, overflow: 'hidden',
              border: '1px solid', borderColor: 'divider', boxShadow: 1,
            }}
          >
            <Media
              item={project.featuredMedia}
              className={`w-full ${project.featuredMedia.type !== 'iframe' ? 'aspect-video' : ''}`}
            />
          </Box>

          {/* Body content */}
          {project.content ? (
            <Box
              className="prose"
              sx={{ color: 'text.secondary', '& a': { color: 'primary.main' } }}
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          ) : project.mediaGallery.length > 0 ? (
            <Box component="section">
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Gallery</Typography>
              <Stack spacing={2}>
                {project.mediaGallery.map((media, idx) => (
                  <Box key={idx} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <Media item={media} className="w-full" />
                    {media.alt && (
                      <Box sx={{ p: 1, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" color="text.disabled">{media.alt}</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {project.summary}
            </Typography>
          )}
        </Box>

        {/* ── Right: sticky keyword panel ── */}
        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 24 },
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Year + Status */}
          {(project.year || project.status) && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {project.year && (
                <Chip label={project.year} size="small" sx={{ bgcolor: 'grey.100', color: 'text.secondary', fontSize: '1rem' }} />
              )}
              {project.status && (
                <Chip label={project.status} size="small" variant="outlined" sx={{ fontSize: '1rem' }} />
              )}
            </Stack>
          )}

          {/* Roles */}
          {project.rolesOrSkills.length > 0 && (
            <Box
              sx={{
                p: 2, borderRadius: 1,
                border: '1px solid', borderColor: '#dde5f0',
                bgcolor: '#f4f6fb',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 3, height: 14, borderRadius: 1, bgcolor: '#8fa8cc', flexShrink: 0 }} />
                <Typography fontWeight={700} sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.disabled' }}>
                  Role
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {project.rolesOrSkills.map(role => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{ fontSize: '0.95rem', height: 28, bgcolor: '#dce6f5', color: '#4a6080', border: '1px solid', borderColor: '#c5d4e8' }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Tech Stack */}
          {project.techStack.length > 0 && (
            <Box
              sx={{
                p: 2, borderRadius: 1,
                border: '1px solid', borderColor: '#e4e7ed',
                bgcolor: '#f7f8fa',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 3, height: 14, borderRadius: 1, bgcolor: '#aab4c2', flexShrink: 0 }} />
                <Typography fontWeight={700} sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.disabled' }}>
                  Tech Stack
                </Typography>
              </Box>
              <Stack spacing={1.75}>
                {project.techStack.map((group) => (
                  <Box key={group.category}>
                    <Typography sx={{ color: '#7a8898', fontWeight: 600, display: 'block', mb: 0.75, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {group.category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {group.skills.map(skill => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{ fontSize: '0.85rem', height: 26, bgcolor: '#eaecf0', color: '#5a6473' }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <Box
              sx={{
                p: 2, borderRadius: 1,
                border: '1px solid', borderColor: '#d8e4f0',
                bgcolor: '#eef3fa',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 3, height: 14, borderRadius: 1, bgcolor: '#8fa8cc', flexShrink: 0 }} />
                <Typography fontWeight={700} sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6a88aa' }}>
                  Links
                </Typography>
              </Box>
              <Stack spacing={0.75}>
                {project.links.map((link) => (
                  <Box
                    key={link.url}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      py: 1, px: 1.25, borderRadius: 1,
                      border: '1px solid', borderColor: '#cfdcea',
                      bgcolor: '#ffffff',
                      textDecoration: 'none', color: 'text.primary',
                      transition: 'background 0.15s, border-color 0.15s',
                      '&:hover': { bgcolor: '#e4eef8', borderColor: '#8fa8cc' },
                    }}
                  >
                    <Typography fontWeight={500} sx={{ fontSize: '0.95rem' }}>{link.label}</Typography>
                    <OpenInNewIcon sx={{ fontSize: '0.9rem', color: '#8fa8cc' }} />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
