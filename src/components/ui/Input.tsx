import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-casino-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl border border-casino-border bg-casino-surface px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-casino-muted/60 focus:border-casino-green focus:ring-1 focus:ring-casino-green/30 ${error ? 'border-casino-danger' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-casino-danger">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
