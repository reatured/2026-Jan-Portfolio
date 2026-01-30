import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { projects } from '../config/projects';
import { Head, generateJsonLd } from '../lib/seo';
import { Media } from '../components/project/Media';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const project = useMemo(() => {
    return projects.find(p => p.slug === slug);
  }, [slug]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const jsonLd = generateJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.summary
  });

  return (
    <article className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      <Head 
        title={project.title} 
        description={project.shortSubtitle}
        image={project.featuredMedia.src}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd}
      />

      {/* Navigation Back */}
      <Link 
        to="/" 
        className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
        Back to Projects
      </Link>

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {project.year && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              {project.year}
            </span>
          )}
          {project.rolesOrSkills.map(role => (
             <span key={role} className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
               {role}
             </span>
          ))}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          {project.title}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          {project.shortSubtitle}
        </p>
      </header>

      {/* Featured Media */}
      <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <Media 
            item={project.featuredMedia} 
            className={`w-full ${project.featuredMedia.type !== 'iframe' ? 'aspect-video' : ''}`} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {project.content ? (
            <div 
              className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          ) : (
            <>
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-2">Overview</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {project.summary}
                </p>
              </section>

              {/* Default Media Gallery */}
              {project.mediaGallery.length > 0 && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {project.mediaGallery.map((media, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden border border-slate-200">
                        <Media item={media} className="w-full" />
                        {media.alt && (
                          <div className="p-2 bg-slate-50 text-[10px] text-slate-500 text-center border-t border-slate-200">
                            {media.alt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tech Stack */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Tech Stack</h3>
            <div className="space-y-3">
              {project.techStack.map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1.5">{group.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Project Links</h3>
              <div className="space-y-2">
                {project.links.map((link) => (
                  <a 
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors group"
                  >
                    <span className="font-medium text-xs">{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </article>
  );
};