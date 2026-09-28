import React from 'react';

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {eyebrow && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-750 block mb-1">
              {eyebrow}
            </span>
          )}
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
};
