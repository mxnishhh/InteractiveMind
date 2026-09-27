import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder = 'Select an option', className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 text-sm transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-100'
              : 'border-slate-300 focus:border-slate-800 focus:ring-slate-100'
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
