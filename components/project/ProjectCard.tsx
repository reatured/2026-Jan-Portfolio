import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Media } from './Media';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Link 
      to={`/projects/${project.slug}`}
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-xl"
    >
      <article className="
        h-full bg-white border border-slate-200 rounded-xl overflow-hidden
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5
        flex flex-col
      ">
        {/* Media Section */}
        <div className="aspect-video w-full border-b border-slate-100 relative overflow-hidden">
           <Media item={project.featuredMedia} className="h-full w-full" />
           <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
             View
           </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            {project.status && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-50 text-[10px] font-medium text-slate-500 border border-slate-100 uppercase tracking-wide">
                {project.status}
              </span>
            )}
          </div>
          
          <p className="text-slate-600 text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">
            {project.shortSubtitle}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.rolesOrSkills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                {skill}
              </span>
            ))}
            {project.rolesOrSkills.length > 3 && (
               <span className="text-[10px] text-slate-400 px-1 py-0.5">+ {project.rolesOrSkills.length - 3}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};