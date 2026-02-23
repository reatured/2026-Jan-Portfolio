import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          {/* Left Column: Sidebar (Sticky) */}
          <Sidebar />

          {/* Right Column: Main Content (Scrollable) */}
          <main className="min-h-[80vh] w-full">
            {children}

            {/* Simple Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200 text-center lg:text-left text-slate-400 text-sm">
              <p>© {new Date().getFullYear()} Built with React, Tailwind & TypeScript.</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin — no sidebar layout */}
          <Route path="/admin" element={<Admin />} />

          {/* Public portfolio */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/projects/:slug" element={<Layout><ProjectDetail /></Layout>} />
        </Routes>
      </Router>
      <Analytics />
    </>
  );
};

export default App;
