import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ 
    label, 
    error, 
    multiline = false, 
    rows = 3,
    className = '', 
    textareaProps,
    ...props 
  }, ref) => {
    const baseClasses = `
      w-full px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm
      bg-surface-secondary text-text-primary border
      focus:outline-none focus:ring-2 focus:ring-white focus:bg-surface-tertiary
      disabled:opacity-50 disabled:cursor-not-allowed
      resize-none
      ${error ? 'border-border-error' : 'border-border-primary focus:border-border-focus'}
      ${className}
    `;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={baseClasses}
            style={{ minHeight: `${rows * 1.5}rem` }}
            rows={rows}
            {...textareaProps}
            {...(props as any)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={baseClasses}
            {...props}
          />
        )}
        {error && (
          <p className="text-sm text-error-60">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField'; 