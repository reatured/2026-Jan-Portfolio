import React from 'react';
import { MediaItem } from '../../types';

interface MediaProps {
  item: MediaItem;
  className?: string;
  priority?: boolean;
}

export const Media: React.FC<MediaProps> = ({ item, className = "" }) => {
  if (item.type === 'iframe') {
    return (
      <div 
        className={`relative overflow-hidden bg-slate-100 rounded-xl ${className}`}
        style={item.height ? { height: `${item.height}px` } : undefined}
      >
        <iframe 
          src={item.src}
          title={item.title || "Interactive Content"}
          className="w-full h-full border-0"
          allow={item.allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
          allowFullScreen
        />
      </div>
    );
  }

  if (item.type === 'video') {
    return (
      <div className={`relative overflow-hidden bg-slate-100 rounded-xl ${className}`}>
        <video 
          src={item.src}
          poster={item.poster}
          controls
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 rounded-xl ${className}`}>
      <img 
        src={item.src} 
        alt={item.alt || "Project media"} 
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};