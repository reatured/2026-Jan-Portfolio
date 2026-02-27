import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Head } from '../lib/seo';
import { projects } from '../config/projects';
import { ProjectCard } from '../components/project/ProjectCard';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

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
        '@keyframes fadeSlideIn': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeSlideIn 0.5s ease both',
      }}
    >
      <Head title={currentCategory ? `${currentCategory} Projects` : "Home"} />

      {/* Intro for mobile */}
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>Welcome</Typography>
        <Typography variant="body2" color="text.secondary">Select a role below or explore my work.</Typography>
      </Box>

      {/* Filter Status */}
      {currentCategory && (
        <Paper
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2, py: 1.25, mb: 3, borderRadius: 2,
          }}
        >
          <Typography variant="caption" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>
            Filtered by:
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {currentCategory}
          </Typography>
        </Paper>
      )}

      {/* Projects List */}
      <Box component="section" id="projects">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {currentCategory ? `${filteredProjects.length} Projects Found` : 'All Projects'}
          </Typography>
          <Box sx={{ height: '1px', bgcolor: 'divider', flexGrow: 1, ml: 2 }} />
        </Box>

        {filteredProjects.length > 0 ? (
          <Stack spacing={2}>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Stack>
        ) : (
          <Paper
            sx={{
              textAlign: 'center', py: 10, borderStyle: 'dashed',
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary">No projects found for this category yet.</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
