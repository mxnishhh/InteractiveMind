import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-100'
              : 'border-slate-300 focus:border-slate-800 focus:ring-slate-100'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
