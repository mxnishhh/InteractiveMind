import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  const ActionIcon = action?.icon;

  return (
    <div className="py-12 px-6 text-center rounded-2xl bg-white border border-stone-200/80 shadow-soft flex flex-col items-center justify-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-850 mb-4 shadow-sm">
        <Icon className="w-6 h-6 text-brand-700" />
      </div>
      <h3 className="font-serif-heading text-lg font-bold text-brand-950 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-600 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="sm">
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span>{action.label}</span>
        </Button>
      )}
    </div>
  );
};
