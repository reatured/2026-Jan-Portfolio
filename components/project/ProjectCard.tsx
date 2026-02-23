import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Media } from './Media';
import { siteConfig } from '../../config/site';

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const techLines = project.techStack.map(group => `${group.category}: ${group.skills.join(', ')}`);

  // Determine what to show in the card thumbnail area
  const thumbnailSrc = project.thumbnail;
  const ytId = thumbnailSrc ? getYouTubeId(thumbnailSrc) : null;
  const thumbnailIsVideo = thumbnailSrc && !ytId && isVideoUrl(thumbnailSrc);

  const cardMedia: import('../../types').MediaItem =
    !thumbnailSrc || ytId
      ? project.featuredMedia.type === 'image'
        ? project.featuredMedia
        : { type: 'image', src: siteConfig.defaultOgImage, alt: `${project.title} preview` }
      : { type: 'image', src: thumbnailSrc, alt: `${project.title} thumbnail` };

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
          {ytId ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                alt={`${project.title} thumbnail`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          ) : thumbnailIsVideo ? (
            <video
              src={thumbnailSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Media item={cardMedia} className="h-full w-full" />
          )}
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
