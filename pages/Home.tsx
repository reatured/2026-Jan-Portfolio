import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Head } from '../lib/seo';
import { projects } from '../config/projects';
import { ProjectCard } from '../components/project/ProjectCard';

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  // Filter projects based on the category param
  const filteredProjects = React.useMemo(() => {
    if (!currentCategory) return projects;
    return projects.filter(p => p.categories.includes(currentCategory));
  }, [currentCategory]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Head title={currentCategory ? `${currentCategory} Projects` : "Home"} />
      
      {/* Intro for Mobile (hidden on LG as it's in sidebar) */}
      <section className="lg:hidden mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome</h2>
        <p className="text-sm text-slate-600">Select a role below or explore my work.</p>
      </section>

      {/* Filter Status Indicator */}
      {currentCategory && (
        <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Filtered by:</span>
            <span className="text-sm font-bold text-slate-900">{currentCategory}</span>
        </div>
      )}

      {/* Projects List */}
      <section id="projects">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {currentCategory ? `${filteredProjects.length} Projects Found` : 'All Projects'}
          </h2>
          <div className="h-px bg-slate-200 flex-grow ml-4"></div>
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No projects found for this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};
