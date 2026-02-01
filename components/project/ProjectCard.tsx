import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Media } from './Media';
import { siteConfig } from '../../config/site';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const cardMedia = project.featuredMedia.type === 'image'
    ? project.featuredMedia
    : { type: 'image', src: siteConfig.defaultOgImage, alt: `${project.title} preview` };

  const techLines = project.techStack.map(group => `${group.category}: ${group.skills.join(', ')}`);

  return (
    <Link 
      to={`/projects/${project.slug}`}
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-xl"
    >
      <article className="
        h-full bg-white border border-slate-200 rounded-xl overflow-hidden
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5
        flex flex-col md:flex-row
      ">
        {/* Media Section */}
        <div className="aspect-video w-full md:w-2/5 border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden">
          <Media item={cardMedia} className="h-full w-full" />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow md:w-3/5">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
            {project.title}
          </h3>

          <p className="text-slate-700 text-sm font-semibold mb-2">
            {project.shortSubtitle}
          </p>
          
          <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
            {project.summary}
          </p>

          <div className="mt-auto">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tech Stack:
            </h4>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {techLines.slice(0, 4).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Link>
  );
};
