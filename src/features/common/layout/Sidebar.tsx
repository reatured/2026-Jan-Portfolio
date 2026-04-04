import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { siteConfig } from '../../../../config/site';
import { M3 } from '../../../app/theme';
import { SocialLink, Role } from '@types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';

const iconMap: Record<string, React.ElementType> = {
  Github: GitHubIcon,
  GitHub: GitHubIcon,
  Linkedin: LinkedInIcon,
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  Mail: EmailIcon,
  Email: EmailIcon,
};

// Enhanced decorative orb backdrop for the header
const DecorativeOrbs: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 220,
      overflow: 'hidden',
      borderRadius: '28px 28px 0 0',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    {/* Simple primary orb */}
    <Box sx={{
      position: 'absolute',
      top: -60, right: -40,
      width: 200, height: 200,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${M3.primaryContainer}70 0%, transparent 70%)`,
      filter: 'blur(20px)',
    }} />
    {/* Simple tertiary accent orb */}
    <Box sx={{
      position: 'absolute',
      top: 40, left: -30,
      width: 140, height: 140,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${M3.tertiaryContainer}50 0%, transparent 70%)`,
      filter: 'blur(16px)',
    }} />
    {/* Simple bright dots */}
    <Box sx={{
      position: 'absolute',
      top: 20, right: 28,
      width: 6, height: 6,
      borderRadius: '50%',
      bgcolor: M3.primary,
      opacity: 0.7,
    }} />
    <Box sx={{
      position: 'absolute',
      top: 60, right: 60,
      width: 3, height: 3,
      borderRadius: '50%',
      bgcolor: M3.tertiary,
      opacity: 0.5,
    }} />
  </Box>
);

// Decorative mesh grid pattern
const MeshPattern: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      opacity: 0.06,
      backgroundImage: `
        linear-gradient(${M3.primary}40 1px, transparent 1px),
        linear-gradient(90deg, ${M3.primary}40 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);

export const Sidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleFilter = (category: string) => {
    if (currentCategory === category) {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <Box
      component="aside"
      sx={{
        alignSelf: 'flex-start',
        top: { lg: 24 },
        height: 'fit-content',
        bgcolor: M3.surfaceContainerLow,
        borderRadius: '28px',
        border: `1px solid ${M3.outlineVariant}`,
        overflow: 'hidden',
        position: 'sticky',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Simple left gradient accent strip */}
      <Box aria-hidden sx={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        background: `linear-gradient(180deg, ${M3.primary} 0%, ${M3.tertiary} 100%)`,
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Decorative header area */}
      <Box sx={{ position: 'relative', px: 2.5, pt: 2.5, pb: 0 }}>
        <DecorativeOrbs />
        <MeshPattern />

        {/* Avatar + name */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'inline-block',
              mb: 2,
              p: '2.5px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${M3.primary} 0%, ${M3.tertiary} 100%)`,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { 
                transform: 'scale(1.05)',
              },
            }}
          >
            <Avatar
              src={siteConfig.avatar}
              alt={siteConfig.siteName}
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: `2.5px solid ${M3.background}`,
              }}
            />
          </Box>

          {/* Name */}
          <Typography
            sx={{
              fontSize: '1.6rem',
              fontFamily: '"Instrument Serif", Georgia, serif',
              color: M3.onSurface,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            {siteConfig.siteName}
          </Typography>

          {/* Simple job title badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: `${M3.primaryContainer}80`,
              border: `1px solid ${M3.primary}40`,
              borderRadius: '999px',
              px: 1.25,
              py: 0.3,
              mb: 1.5,
            }}
          >
            {/* Pulsing dot */}
            <Box sx={{
              width: 5, height: 5, borderRadius: '50%',
              bgcolor: M3.primary,
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.5, transform: 'scale(0.8)' },
              },
              animation: 'pulse 2.5s ease-in-out infinite',
            }} />
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: M3.primary,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {siteConfig.jobTitle}
            </Typography>
          </Box>

          {/* Bio */}
          <Typography
            sx={{
              fontSize: '0.825rem',
              color: M3.onSurfaceVariant,
              mb: 1.75,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {siteConfig.bio}
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5 }}>
            {siteConfig.socialLinks.map((link: SocialLink) => {
              const Icon = iconMap[link.icon] ?? LinkIcon;
              return (
                <Tooltip key={link.platform} title={link.platform} placement="top">
                  <IconButton
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    aria-label={link.platform}
                    sx={{
                      color: M3.onSurfaceVariant,
                      borderRadius: '8px',
                      width: 32, height: 32,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: M3.primary,
                        bgcolor: `${M3.primaryContainer}60`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Core Skills */}
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{
            width: 6, height: 6,
            borderRadius: '2px',
            bgcolor: M3.tertiary,
            transform: 'rotate(45deg)',
            flexShrink: 0,
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
            Core Skills
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {['Teleoperation', 'Computer Vision', 'URDF', 'CAD/3D Printing', 'Physics Simulation', 'Real-Time Systems', 'MediaPipe', 'ROS'].map((skill) => (
            <Typography
              key={skill}
              component="span"
              sx={{
                fontSize: '0.6rem',
                fontWeight: 600,
                color: M3.onSecondaryContainer,
                bgcolor: M3.secondaryContainer,
                px: 1,
                py: 0.25,
                borderRadius: '9999px',
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              {skill}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Simple gradient divider */}
      <Box sx={{
        mx: 2.5,
        height: '1px',
        background: `linear-gradient(90deg, ${M3.primary}50, ${M3.tertiary}30, transparent)`,
        mb: 0,
      }} />

      {/* Role Filter — with its own slightly elevated background */}
      <Box sx={{ px: 2, pt: 2, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Small diamond icon */}
            <Box sx={{
              width: 6, height: 6,
              borderRadius: '2px',
              bgcolor: M3.primary,
              transform: 'rotate(45deg)',
              flexShrink: 0,
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
              Filter by Role
            </Typography>
          </Box>
          {currentCategory && (
            <Typography
              component="button"
              onClick={() => setSearchParams({})}
              sx={{
                fontSize: '0.6rem',
                fontWeight: 700,
                color: M3.primary,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                p: 0,
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                '&:hover': { opacity: 0.75 },
              }}
            >
              Clear
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {siteConfig.roles.map((role: Role) => {
            const isActive = currentCategory === role.title;
            return (
              <ButtonBase
                key={role.title}
                onClick={() => handleFilter(role.title)}
                aria-pressed={isActive}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1.5,
                  textAlign: 'left',
                  borderRadius: '12px',
                  bgcolor: isActive ? M3.primaryContainer : 'transparent',
                  border: `1px solid ${isActive ? M3.primary + '50' : 'transparent'}`,
                  py: 0.75,
                  px: 1.25,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: isActive ? M3.primaryContainer : M3.surfaceContainerHigh,
                    transform: 'translateX(2px)',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${M3.primary}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {/* Simple active indicator dot */}
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  bgcolor: isActive ? M3.primary : `${M3.onSurfaceVariant}40`,
                  transition: 'background-color 0.2s',
                }} />
                <Typography
                  sx={{
                    fontSize: '0.825rem',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? M3.onPrimaryContainer : M3.onSurface,
                    letterSpacing: '-0.01em',
                    fontFamily: '"Space Grotesk", sans-serif',
                    textAlign: 'left',
                    lineHeight: 1.3,
                  }}
                >
                  {role.title}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
