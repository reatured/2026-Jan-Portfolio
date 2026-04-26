import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
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
      borderRadius: '20px',
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

const InfoPanel: React.FC<{ project: Project; onOpenModal: (index: number) => void }> = ({ project, onOpenModal }) => {
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
            {project.links.map((link, index) => {
              const modalItems = project.mediaGallery.filter(item => item.presentation === 'modal');
              const liveSimulationIndex = modalItems.findIndex(item => item.label === 'Live Interaction');
              const youtubeDemoIndex = modalItems.findIndex(item => item.label === 'YouTube Demo');
              
              let isModalLink = false;
              let modalIndex = 0;
              
              if (/live|simulation/i.test(link.label) && liveSimulationIndex !== -1) {
                isModalLink = true;
                modalIndex = liveSimulationIndex;
              } else if (/youtube|demo/i.test(link.label) && youtubeDemoIndex !== -1) {
                isModalLink = true;
                modalIndex = youtubeDemoIndex;
              }
              
              return (
                <Box
                  key={link.url}
                  component={isModalLink ? "button" : "a"}
                  {...(!isModalLink && {
                    href: link.url,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  })}
                  onClick={isModalLink ? () => onOpenModal(modalIndex) : undefined}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.75,
                    px: 1,
                    textDecoration: 'none',
                    color: M3.onSurface,
                    borderRadius: '12px',
                    transition: 'all 0.2s var(--easing-emphasized)',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
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
                  {isModalLink ? (
                    <PlayArrowRoundedIcon sx={{ fontSize: '0.8rem', color: 'inherit' }} />
                  ) : (
                    <OpenInNewIcon sx={{ fontSize: '0.8rem', color: 'inherit' }} />
                  )}
                </Box>
              );
            })}
          </Stack>
        </MetaCard>
      )}
    </Box>
  );
};

const FactChip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
    <Typography
      component="span"
      sx={{
        fontSize: '0.6rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: M3.onSurfaceVariant,
        fontFamily: '"Space Grotesk", sans-serif',
        opacity: 0.7,
      }}
    >
      {label}
    </Typography>
    <Typography
      component="span"
      sx={{
        fontSize: '0.8rem',
        fontWeight: 500,
        color: M3.onSurface,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {value}
    </Typography>
  </Box>
);

interface IframeCardProps {
  src: string;
  poster?: string;
  title: string;
  allow?: string;
  isLive: boolean;
  onPlay: () => void;
  onStop: () => void;
}

const IframeCard: React.FC<IframeCardProps> = ({ src, poster, title, allow, isLive, onPlay, onStop }) => (
  <Box
    sx={{
      borderRadius: '16px',
      overflow: 'hidden',
      bgcolor: M3.surfaceContainerHighest,
      border: `1px solid ${M3.outlineVariant}40`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 14px 36px rgba(0,0,0,0.32)',
      },
    }}
  >
    <Box sx={{ aspectRatio: '21 / 9', width: '100%', position: 'relative' }}>
      {isLive ? (
        <>
          <Box
            component="iframe"
            src={src}
            title={title}
            allow={allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
            allowFullScreen
            sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          />
          <Box
            onClick={onStop}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              cursor: 'pointer',
              bgcolor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              borderRadius: '999px',
              px: 1.25,
              py: 0.4,
              fontSize: '0.7rem',
              fontWeight: 600,
              fontFamily: '"Space Grotesk", sans-serif',
              backdropFilter: 'blur(6px)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            }}
          >
            ✕ Stop
          </Box>
        </>
      ) : (
        <Box
          onClick={onPlay}
          sx={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            position: 'relative',
            backgroundImage: poster ? `url(${poster})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            background: poster ? undefined : `linear-gradient(135deg, ${M3.primaryContainer}55, ${M3.tertiaryContainer}55)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.25s ease',
            '&:hover .play-btn': {
              transform: 'scale(1.08)',
              bgcolor: M3.primary,
              color: M3.onPrimary,
            },
          }}
        >
          <Box
            className="play-btn"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.4rem',
              border: '2px solid rgba(255,255,255,0.85)',
              transition: 'transform 0.2s ease, background-color 0.2s ease, color 0.2s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            }}
          >
            ▶
          </Box>
        </Box>
      )}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.75, py: 1 }}>
      <Typography
        sx={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: M3.onSurface,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        {title}
      </Typography>
      {isLive && (
        <Typography
          sx={{
            fontSize: '0.6rem',
            color: M3.primary,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ● Live
        </Typography>
      )}
    </Box>
  </Box>
);

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(slug || '');
  const [activeModalMediaIndex, setActiveModalMediaIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [liveIframeIndex, setLiveIframeIndex] = useState<number | null>(null);

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
  const PLACEHOLDER_SRC = '/assets/cargo-import/page-4/Instagram-post---3.PNG';
  const hasMeaningfulMedia =
    project.featuredMedia.type !== 'image' ||
    (project.featuredMedia.src !== PLACEHOLDER_SRC && project.featuredMedia.src !== '');
  const modalGalleryItems = project.mediaGallery.filter(item => item.presentation === 'modal');
  const galleryItems = project.mediaGallery.filter((item) => {
    const isDuplicateFeatured = item.src === project.featuredMedia.src && item.type === project.featuredMedia.type;
    return !isDuplicateFeatured && item.presentation !== 'modal';
  });
  const isAllIframeGallery = galleryItems.length > 0 && galleryItems.every((m) => m.type === 'iframe');
  const isGalleryHeavyProject = galleryItems.length >= 6 && !isAllIframeGallery;
  const highlightGalleryItems = isGalleryHeavyProject ? galleryItems.slice(0, 4) : [];
  const remainingGalleryItems = isGalleryHeavyProject ? galleryItems.slice(4) : galleryItems;
  const activeModalMedia = activeModalMediaIndex !== null ? modalGalleryItems[activeModalMediaIndex] : null;
  // All image items across both gallery sections, for lightbox navigation
  const lightboxItems = galleryItems.filter(m => m.type === 'image');
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
        onClick={() => {
          const savedUrl = sessionStorage.getItem('homepageUrl') || '/';
          navigate(savedUrl);
        }}
        startIcon={<ArrowBackIcon sx={{ fontSize: '0.8rem !important' }} />}
        size="small"
        sx={{
          mb: 4,
          color: M3.onSurfaceVariant,
          fontWeight: 600,
          fontSize: '0.8rem',
          borderRadius: '12px',
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
          borderRadius: { xs: '28px', lg: '36px' },
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
            gridTemplateColumns: hasMeaningfulMedia
              ? { xs: '1fr', xl: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)' }
              : '1fr',
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
                mb: 2.5,
              }}
            >
              {project.shortSubtitle || project.summary}
            </Typography>

            {/* Interactive Demo Buttons */}
            {modalGalleryItems.length > 0 && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mb: 3 }}>
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
            )}

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 0,
                rowGap: 0.5,
              }}
            >
              {[
                project.year ? { label: 'Year', value: project.year } : null,
                project.status ? { label: 'Status', value: project.status } : null,
                project.rolesOrSkills.length > 0 ? { label: 'Role', value: project.rolesOrSkills.slice(0, 2).join(' / ') } : null,
                stackItems.length > 0 ? { label: 'Stack', value: stackItems.slice(0, 3).join(' / ') } : null,
              ].filter(Boolean).map((item, idx, arr) => (
                <React.Fragment key={item!.label}>
                  <FactChip label={item!.label} value={item!.value} />
                  {idx < arr.length - 1 && (
                    <Typography
                      component="span"
                      sx={{
                        mx: 1,
                        color: M3.outlineVariant,
                        fontSize: '0.65rem',
                        lineHeight: 1,
                        userSelect: 'none',
                      }}
                    >
                      ·
                    </Typography>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>

          {hasMeaningfulMedia && (
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
          )}
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

      {highlightGalleryItems.length > 0 && (
        <Box
          component="section"
          sx={{
            mt: { xs: 4, lg: 5 },
            mb: { xs: 5, lg: 6 },
          }}
        >
          <Box sx={{ mb: 2.5, px: { xs: 0.5, md: 0 } }}>
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

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              pb: 2,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: `${M3.outlineVariant}80`,
                borderRadius: 3,
              },
            }}
          >
            {highlightGalleryItems.map((media, idx) => {
              const lbIdx = lightboxItems.indexOf(media);
              const isClickable = lbIdx !== -1;
              return (
              <Box
                key={`highlight-${media.src}-${idx}`}
                onClick={() => isClickable && setLightboxIndex(lbIdx)}
                sx={{
                  flexShrink: 0,
                  width: media.type === 'video'
                    ? { xs: '80%', sm: '65%', md: '50%', lg: '42%' }
                    : { xs: '72%', sm: '55%', md: '40%', lg: '34%' },
                  scrollSnapAlign: 'start',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  bgcolor: M3.surfaceContainerHighest,
                  cursor: isClickable ? 'zoom-in' : 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': isClickable ? {
                    transform: 'scale(1.02)',
                    boxShadow: `0 12px 40px rgba(0,0,0,0.35)`,
                  } : {},
                }}
              >
                <Media item={media} className="w-full" autoPlayVideo />
              </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Lightbox modal for gallery images */}
      <Dialog
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 'min(95vw, 1400px)',
            height: 'min(90vh, 900px)',
            maxWidth: 'none',
            m: 0,
            borderRadius: { xs: '20px', md: '28px' },
            overflow: 'hidden',
            bgcolor: M3.surfaceContainerLowest,
            border: `1px solid ${M3.outlineVariant}44`,
            boxShadow: '0 32px 120px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(3, 3, 7, 0.8)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: `1px solid ${M3.outlineVariant}44` }}>
          <Typography sx={{ fontSize: '0.8rem', color: M3.onSurfaceVariant, fontFamily: '"Space Grotesk", sans-serif' }}>
            {lightboxIndex !== null ? `${lightboxIndex + 1} / ${lightboxItems.length}` : ''}
          </Typography>
          <IconButton onClick={() => setLightboxIndex(null)} sx={{ color: M3.onSurface }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, minHeight: 0 }}>
          {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
            <Box
              component="img"
              src={lightboxItems[lightboxIndex].src}
              alt={lightboxItems[lightboxIndex].alt || ''}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
          )}
        </Box>
        {lightboxItems.length > 1 && lightboxIndex !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, px: 2.5, py: 1.5, borderTop: `1px solid ${M3.outlineVariant}44` }}>
            <Button
              onClick={() => setLightboxIndex((prev) => prev !== null ? Math.max(0, prev - 1) : null)}
              disabled={lightboxIndex === 0}
              size="small"
              sx={{ minWidth: 'auto', color: M3.onSurface }}
            >
              Previous
            </Button>
            <Button
              onClick={() => setLightboxIndex((prev) => prev !== null ? Math.min(lightboxItems.length - 1, prev + 1) : null)}
              disabled={lightboxIndex === lightboxItems.length - 1}
              size="small"
              sx={{ minWidth: 'auto', color: M3.onSurface }}
            >
              Next
            </Button>
          </Box>
        )}
      </Dialog>

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
              borderRadius: '28px',
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
                    gap: 0.5,
                  },
                  '& section + section': {
                    mt: { xs: 2.5, md: 3 },
                    pt: { xs: 2, md: 2.5 },
                    borderTop: `1px solid ${M3.outlineVariant}55`,
                  },
                  '& h2:first-of-type': {
                    mt: 0,
                  },
                  '& h2': {
                    fontSize: { xs: '1.4rem', md: '1.7rem' },
                    m: 0,
                    mb: 0.25,
                  },
                  '& h3': {
                    fontSize: { xs: '1.08rem', md: '1.25rem' },
                    color: M3.onSurface,
                    m: 0,
                    mt: 0.5,
                  },
                  '& p': {
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    lineHeight: 1.6,
                    color: M3.onSurfaceVariant,
                    m: 0,
                  },
                  '& ul, & ol': {
                    display: 'grid',
                    gap: 0.25,
                    pl: 2.2,
                    m: 0,
                  },
                  '& li': {
                    lineHeight: 1.5,
                  },
                  '& li::marker': {
                    color: M3.primary,
                  },
                  '& figure, & img, & video, & iframe': {
                    width: '100%',
                    maxWidth: '100%',
                  },
                  '& img, & video, & iframe': {
                    borderRadius: '28px',
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
                    gap: 0.75,
                    my: 1,
                  },
                  '& .project-fact': {
                    p: 1.25,
                    borderRadius: '20px',
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
                  '& .data-table': {
                    width: 'auto',
                    minWidth: '260px',
                    borderCollapse: 'collapse',
                    fontSize: '0.8rem',
                    fontFamily: '"Space Grotesk", sans-serif',
                    my: 0.5,
                  },
                  '& .data-table th': {
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: M3.onSurfaceVariant,
                    px: 1.5,
                    py: 0.75,
                    textAlign: 'left',
                    borderBottom: `1px solid ${M3.outlineVariant}55`,
                  },
                  '& .data-table td': {
                    px: 1.5,
                    py: 0.5,
                    color: M3.onSurface,
                    whiteSpace: 'nowrap',
                    borderBottom: `1px solid ${M3.outlineVariant}22`,
                  },
                  '& .data-table td:nth-of-type(2)': {
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                    color: M3.primary,
                    fontFamily: '"Space Grotesk", monospace',
                  },
                  '& .data-table td:nth-of-type(3)': {
                    fontVariantNumeric: 'tabular-nums',
                    color: M3.onSurfaceVariant,
                    fontFamily: '"Space Grotesk", monospace',
                  },
                  '& .data-table tbody tr:last-of-type td': {
                    borderBottom: 'none',
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
                borderRadius: '12px',
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
              {(() => {
                const isShaderGallery = remainingGalleryItems.every((m) => m.type === 'shader');
                const isIframeGallery = remainingGalleryItems.every((m) => m.type === 'iframe');
                if (isShaderGallery || isIframeGallery) {
                  return (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: 2,
                      }}
                    >
                      {remainingGalleryItems.map((media, idx) => (
                        isShaderGallery ? (
                          <Box key={`${media.src}-${idx}`}>
                            <Media item={media} frameSx={{ aspectRatio: '21 / 9' }} />
                            {(media.label || media.alt) && (
                              <Typography
                                sx={{
                                  mt: 1,
                                  fontSize: '0.7rem',
                                  letterSpacing: '0.06em',
                                  textTransform: 'uppercase',
                                  color: M3.onSurfaceVariant,
                                  fontFamily: '"Space Grotesk", sans-serif',
                                }}
                              >
                                {media.label || media.alt}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <IframeCard
                            key={`${media.src}-${idx}`}
                            src={media.src}
                            poster={(media as any).poster}
                            title={media.label || media.alt || 'Embed'}
                            allow={media.allow}
                            isLive={liveIframeIndex === idx}
                            onPlay={() => setLiveIframeIndex(idx)}
                            onStop={() => setLiveIframeIndex(null)}
                          />
                        )
                      ))}
                    </Box>
                  );
                }
                return (
                  <Box
                    sx={{
                      columns: { xs: 2, sm: 3 },
                      columnGap: '10px',
                    }}
                  >
                    {remainingGalleryItems.map((media, idx) => {
                      const lbIdx = lightboxItems.indexOf(media);
                      const isClickable = lbIdx !== -1;
                      return (
                        <Box
                          key={`${media.src}-${idx}`}
                          onClick={() => isClickable && setLightboxIndex(lbIdx)}
                          sx={{
                            breakInside: 'avoid',
                            mb: '10px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            bgcolor: M3.surfaceContainerHighest,
                            cursor: isClickable ? 'zoom-in' : 'default',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': isClickable ? {
                              transform: 'scale(1.015)',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
                            } : {},
                          }}
                        >
                          <Box
                            component="img"
                            src={media.src}
                            alt={media.alt || 'Project media'}
                            loading="lazy"
                            sx={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                            }}
                          />
                          {media.alt && (
                            <Box sx={{ px: 1.5, py: 0.75 }}>
                              <Typography
                                sx={{
                                  fontSize: '0.65rem',
                                  color: M3.onSurfaceVariant,
                                  fontFamily: '"Space Grotesk", sans-serif',
                                }}
                              >
                                {media.alt}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })()}
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
            <InfoPanel project={project} onOpenModal={setActiveModalMediaIndex} />
          </Box>
        </Box>

        <Box
          sx={{
            position: { lg: 'sticky' },
            top: { lg: 120 },
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <InfoPanel project={project} onOpenModal={setActiveModalMediaIndex} />
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
          <Box sx={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%' }}>
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
                  borderRadius: { xs: '20px', md: '28px' },
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
            {modalGalleryItems.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 2, md: 3 },
                  py: { xs: 1.5, md: 2 },
                  borderTop: `1px solid ${M3.outlineVariant}55`,
                }}
              >
                <Button
                  onClick={() => setActiveModalMediaIndex((prev) => (prev === null ? null : (prev - 1 + modalGalleryItems.length) % modalGalleryItems.length))}
                  disabled={activeModalMediaIndex === 0}
                  sx={{ minWidth: 'auto' }}
                >
                  Previous
                </Button>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: M3.onSurfaceVariant,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {activeModalMediaIndex + 1} of {modalGalleryItems.length}
                </Typography>
                <Button
                  onClick={() => setActiveModalMediaIndex((prev) => (prev === null ? null : (prev + 1) % modalGalleryItems.length))}
                  disabled={activeModalMediaIndex === modalGalleryItems.length - 1}
                  sx={{ minWidth: 'auto' }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
