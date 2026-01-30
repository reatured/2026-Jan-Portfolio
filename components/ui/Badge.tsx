import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'outline' }> = ({ children, variant = 'default' }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-slate-100 text-slate-800",
    outline: "border border-slate-200 text-slate-600"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </span>
  );
};