import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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

const accentColors = ['#60a5fa', '#34d399', '#c084fc', '#fb923c', '#f472b6'];

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
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: { lg: 'sticky' },
        top: { lg: 24 },
        height: 'fit-content',
      }}
    >
      {/* Profile Card */}
      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'block',
              mb: 2,
              borderRadius: '50%',
              overflow: 'hidden',
              width: 80,
              height: 80,
              flexShrink: 0,
              '&:hover img': { transform: 'scale(1.05)' },
            }}
          >
            <Avatar
              src={siteConfig.avatar}
              alt={siteConfig.siteName}
              sx={{
                width: 80,
                height: 80,
                transition: 'transform 0.5s ease',
              }}
            />
          </Box>

          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25, letterSpacing: '-0.02em' }}>
            {siteConfig.siteName}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1.5 }}>
            {siteConfig.jobTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6, whiteSpace: 'pre-line' }}
          >
            {siteConfig.bio}
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-start' }}>
            {siteConfig.socialLinks.map((link) => {
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
                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Paper>

      {/* Role Filter */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
            Filter by Role
          </Typography>
          {currentCategory && (
            <Typography
              component="button"
              variant="caption"
              onClick={() => setSearchParams({})}
              sx={{
                color: 'primary.main',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                p: 0,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Clear Filter
            </Typography>
          )}
        </Box>

        {siteConfig.roles.map((role, idx) => {
          const isActive = currentCategory === role.title;
          return (
            <ButtonBase
              key={idx}
              onClick={() => handleFilter(role.title)}
              sx={{
                width: '100%',
                textAlign: 'left',
                borderRadius: 2,
                border: '1px solid',
                borderColor: isActive ? 'transparent' : 'divider',
                bgcolor: isActive ? 'text.primary' : 'background.paper',
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: isActive ? 'transparent' : 'text.disabled',
                  boxShadow: isActive ? 2 : 1,
                },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: accentColors[idx % accentColors.length],
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: isActive ? 'common.white' : 'text.primary' }}
                >
                  {role.title}
                </Typography>
              </Box>

              <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
                {role.details.map((detail, i) => (
                  <Box
                    component="li"
                    key={i}
                    sx={{
                      position: 'relative',
                      '&::before': {
                        content: '"•"',
                        position: 'absolute',
                        left: '-12px',
                        color: isActive ? 'rgba(255,255,255,0.4)' : 'text.disabled',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: isActive ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                        lineHeight: 1.5,
                      }}
                    >
                      {detail}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};
