import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { portfolioTheme, adminTheme } from './theme';
import { Sidebar } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';
import { Admin } from './pages/Admin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 3, lg: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '340px 1fr' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          <Sidebar />

          <Box component="main" sx={{ minHeight: '80vh', width: '100%' }}>
            {children}

            <Box
              component="footer"
              sx={{
                mt: 6,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                textAlign: { xs: 'center', lg: 'left' },
              }}
            >
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} Built with React, MUI &amp; TypeScript.
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
    <>
      <Router>
        <ScrollToTop />
        <Routes>
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
      </Router>
      <Analytics />
    </>
  );
};

export default App;
