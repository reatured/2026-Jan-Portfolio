import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { portfolioTheme, adminTheme } from './theme';
import { queryClient } from '../infrastructure/state/queryClient';
import { Sidebar } from '../features/common/layout/Sidebar';
import { MobileAppBar } from '../features/common/layout/MobileAppBar';
import { MobileDrawer } from '../features/common/layout/MobileDrawer';
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Admin = React.lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Prevent browser's built-in scroll restoration from interfering
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  React.useEffect(() => {
    // Don't touch scroll when returning to homepage — Home component handles it
    if (pathname === '/') return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Mobile app bar */}
      {!isDesktop && (
        <MobileAppBar onMenuClick={() => setDrawerOpen(true)} />
      )}

      {/* Mobile drawer */}
      {!isDesktop && (
        <MobileDrawer
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      <Box
        sx={{
          width: '100%',
          maxWidth: 1600,
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 5 },
          py: { xs: 2, lg: 4 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' },
            gap: { xs: 4, lg: 5 },
            alignItems: 'start',
          }}
        >
          {/* Desktop sidebar */}
          {isDesktop && <Sidebar />}

          <Box component="main" sx={{ minHeight: '80vh', width: '100%', minWidth: 0, overflow: 'hidden' }}>
            {children}

            <Box
              component="footer"
              sx={{
                mt: 8,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.secondary',
                  letterSpacing: '0.04em',
                }}
              >
                © {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <React.Suspense fallback={null}>
          <Routes>
            {/* Redirect /dashboard to /admin */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

            {/* Admin — dark theme, no sidebar */}
            <Route
              path="/admin"
              element={
                <ThemeProvider theme={adminTheme}>
                  <CssBaseline />
                  <Admin />
                </ThemeProvider>
              }
            />

            {/* Public portfolio — light theme */}
            <Route
              path="/"
              element={
                <ThemeProvider theme={portfolioTheme}>
                  <CssBaseline />
                  <Layout><Home /></Layout>
                </ThemeProvider>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <ThemeProvider theme={portfolioTheme}>
                  <CssBaseline />
                  <Layout><ProjectDetail /></Layout>
                </ThemeProvider>
              }
            />
          </Routes>
        </React.Suspense>
      </Router>
      <Analytics />
    </QueryClientProvider>
  );
};

export default App;
