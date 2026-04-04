import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Project, SiteConfig } from '@types';
import { Toast, genId, slugify } from './admin-components';
import { ProjectForm } from './admin-components/ProjectForm';
import { SiteConfigForm } from './admin-components/SiteConfigForm';
import { ProjectsTable } from './admin-components/ProjectsTable';
import { HistoryModal } from './admin-components/HistoryModal';
import {
  useData,
  useProjects,
  useSiteConfig,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useReorderProjects,
  useUpdateSiteConfig,
  useProjectHistory,
  useRestoreProjectVersion,
} from '../../infrastructure/api/hooks';

// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';

// ── Default blank project ─────────────────────────────────────────────────────

function blankProject(): Project {
  return {
    id: genId(),
    slug: '',
    title: '',
    year: new Date().getFullYear().toString(),
    status: '',
    shortSubtitle: '',
    summary: '',
    content: '',
    categories: [],
    rolesOrSkills: [],
    techStack: [{ category: '', skills: [] }],
    featuredMedia: { type: 'image', src: '', alt: '' },
    thumbnail: '',
    mediaGallery: [],
    links: [],
    isFeatured: false,
    section: 'Most Recent',
  };
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export const Admin: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // React Query hooks
  const { data, isLoading: loading, error } = useData();
  const projects = data?.projects || [];
  const site = data?.site;

  // Mutations
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const reorderProjectsMutation = useReorderProjects();
  const updateSiteMutation = useUpdateSiteConfig();
  const restoreVersionMutation = useRestoreProjectVersion();

  const isConnected = !error;

  function showToast(msg: string) { setToast(msg); }

  async function handleSaveProject(p: Project) {
    try {
      if (projects.find((x) => x.id === p.id)) {
        await updateProjectMutation.mutateAsync({ id: p.id, project: p });
      } else {
        await createProjectMutation.mutateAsync(p);
      }
      setShowForm(false);
      setEditProject(null);
      showToast('Project saved!');
    } catch (error) {
      showToast('Error: Save failed');
    }
  }

  async function handleDeleteProject(id: string) {
    try {
      await deleteProjectMutation.mutateAsync(id);
      showToast('Project deleted.');
    } catch (error) {
      showToast('Error: Delete failed');
    }
  }

  async function handleSaveSite(s: SiteConfig) {
    try {
      await updateSiteMutation.mutateAsync(s);
      showToast('Site config saved!');
    } catch (error) {
      showToast('Error: Save failed');
    }
  }

  async function handleRestore(projectId: string, savedAt: string) {
    try {
      await restoreVersionMutation.mutateAsync({ id: projectId, savedAt });
      showToast('Version restored!');
    } catch (error) {
      showToast('Error: Restore failed');
    }
  }

  async function handleReorder(ids: string[]) {
    try {
      await reorderProjectsMutation.mutateAsync(ids);
      showToast('Order updated.');
    } catch (error) {
      showToast('Error: Reorder failed');
    }
  }

  function openNew() { setEditProject(blankProject()); setShowForm(true); }
  function openEdit(p: Project) { setEditProject(p); setShowForm(true); }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}
      >
        <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '-0.01em', flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Chip
            label={isConnected ? 'Server connected' : 'Server offline'}
            size="small"
            color={isConnected ? 'success' : 'error'}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <Button component={Link} to="/" color="inherit" size="small" sx={{ color: 'text.secondary' }}>
            ← Back to site
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 20, gap: 2 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">Connecting to admin server…</Typography>
          </Box>
        )}

        {/* Not connected */}
        {!loading && !isConnected && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              sx={{
                p: 5, textAlign: 'center', maxWidth: 480, borderRadius: 3,
              }}
            >
              <Typography variant="h3" sx={{ mb: 2 }}>🔌</Typography>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>Admin server not running</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The admin panel requires the local server to make changes. Start it in your terminal:
              </Typography>
              <Paper variant="outlined" sx={{ px: 2, py: 1.5, mb: 1, textAlign: 'left', fontFamily: 'monospace', bgcolor: 'background.default' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'success.main' }}>npm run admin</Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary">or run both Vite + admin together:</Typography>
              <Paper variant="outlined" sx={{ px: 2, py: 1.5, mt: 1, mb: 3, textAlign: 'left', bgcolor: 'background.default' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'success.main' }}>npm run dev:all</Typography>
              </Paper>
              <Button variant="outlined" onClick={() => window.location.reload()}>Retry connection</Button>
            </Paper>
          </Box>
        )}

        {/* Connected UI */}
        {!loading && isConnected && (
          <>
            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ mb: 4, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Tab label={`Projects (${projects.length})`} />
              <Tab label="Site Config" />
            </Tabs>

            {/* Projects Tab */}
            {tab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>Projects</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {projects.filter((p) => p.isFeatured).length} featured ·{' '}
                      {projects.filter((p) => p.section === 'Current Projects').length} current ·{' '}
                      {projects.filter((p) => p.section === 'Archive').length} archived
                    </Typography>
                  </Box>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
                    New Project
                  </Button>
                </Box>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                  <ProjectsTable
                    projects={projects}
                    onEdit={openEdit}
                    onDelete={handleDeleteProject}
                    onHistory={(projectId) => setShowHistory(projectId)}
                    onReorder={handleReorder}
                  />
                </Paper>
              </Box>
            )}

            {/* Site Config Tab */}
            {tab === 1 && site && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>Site Config</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Basic info, avatar, SEO settings, navigation, roles.</Typography>
                </Box>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <SiteConfigForm initial={site} onSave={handleSaveSite} />
                </Paper>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Project Form Modal */}
      {showForm && editProject && (
        <ProjectForm
          initial={editProject}
          onSave={handleSaveProject}
          onCancel={() => { setShowForm(false); setEditProject(null); }}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          projectId={showHistory}
          onRestore={(savedAt) => handleRestore(showHistory, savedAt)}
          onClose={() => setShowHistory(null)}
        />
      )}

      {/* Toast */}
      <Toast msg={toast} onDone={() => setToast('')} />
    </Box>
  );
}
