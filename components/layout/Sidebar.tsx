import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import * as Icons from 'lucide-react';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name];
  return Icon ? <Icon className={className} /> : null;
};

export const Sidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleFilter = (category: string) => {
    if (currentCategory === category) {
      setSearchParams({}); // Clear filter if clicking same category
    } else {
      setSearchParams({ category });
    }
  };

  const accentColors = [
    'bg-blue-400', 
    'bg-emerald-400', 
    'bg-purple-400', 
    'bg-orange-400', 
    'bg-pink-400'
  ];

  return (
    <aside className="lg:sticky lg:top-6 h-fit space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Link to="/" className="group relative w-20 h-20 mb-4 overflow-hidden rounded-full ring-2 ring-slate-100">
             <img 
               src={siteConfig.avatar} 
               alt={siteConfig.siteName} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
          </Link>
          
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            {siteConfig.siteName}
          </h1>
          <p className="text-slate-500 font-medium text-sm mb-3">{siteConfig.jobTitle}</p>
          
          <p className="text-slate-600 leading-relaxed text-sm mb-4 whitespace-pre-line">
            {siteConfig.bio}
          </p>
          
          {/* Social Links */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {siteConfig.socialLinks.map((link) => (
              <a 
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                aria-label={link.platform}
              >
                <IconRenderer name={link.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Role Cards - Filterable List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter by Role</span>
            {currentCategory && (
                <button 
                    onClick={() => setSearchParams({})}
                    className="text-[10px] text-blue-500 hover:underline"
                >
                    Clear Filter
                </button>
            )}
        </div>
        {siteConfig.roles.map((role, idx) => {
          const isActive = currentCategory === role.title;
          return (
            <button
              key={idx}
              onClick={() => handleFilter(role.title)}
              className={`
                text-left w-full p-3 rounded-lg border transition-all duration-200
                flex flex-col group outline-none focus:ring-2 focus:ring-blue-200
                ${isActive 
                  ? 'bg-slate-900 border-slate-900 shadow-md transform -translate-y-0.5' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${accentColors[idx % accentColors.length]} ${isActive ? 'ring-2 ring-white/20' : ''}`} />
                <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {role.title}
                </span>
              </div>
              
              <ul className="space-y-1 pl-4">
                {role.details.map((detail, i) => (
                  <li 
                    key={i} 
                    className={`
                        text-xs leading-tight relative before:content-['•'] before:absolute before:-left-3
                        ${isActive ? 'text-slate-300 before:text-slate-500' : 'text-slate-600 before:text-slate-300'}
                    `}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </aside>
  );
};