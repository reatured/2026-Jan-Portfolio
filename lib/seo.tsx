import React, { useEffect } from 'react';
import { siteConfig } from '../config/site';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
}

export const Head: React.FC<SeoProps> = ({ 
  title, 
  description = siteConfig.defaultDescription, 
  image = siteConfig.defaultOgImage 
}) => {
  useEffect(() => {
    // Update Title
    const finalTitle = title 
      ? siteConfig.titleTemplate.replace('%s', title) 
      : siteConfig.defaultTitle;
    document.title = finalTitle;

    // Update Meta Tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', finalTitle);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', window.location.href);
    updateMeta('twitter:card', 'summary_large_image');
  }, [title, description, image]);

  return null; // This component renders nothing visually
};

export const generateJsonLd = (data: Record<string, any>) => {
    return {
        __html: JSON.stringify(data)
    }
}