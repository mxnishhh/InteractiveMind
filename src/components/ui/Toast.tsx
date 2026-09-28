'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type = 'success', message, onClose }) => {
  const styles = {
    success: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/90 shadow-soft',
    error: 'bg-rose-50/90 text-rose-900 border-rose-200/90 shadow-soft',
    info: 'bg-brand-50/90 text-brand-900 border-brand-200/90 shadow-soft',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-700 shrink-0" />,
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-xs sm:text-sm font-medium ${styles[type]} transition-all animate-fade-in`}>
      {icons[type]}
      <div className="flex-1 pt-0.5 leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
