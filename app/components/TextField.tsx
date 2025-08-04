import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useThemeJson } from '../hooks/useThemeJson';

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
    const { colors, components } = useThemeJson();

    const baseClasses = `
      w-full px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      resize-none
      ${className}
    `;

    const inputStyle = {
      backgroundColor: components.input.background,
      color: components.input.text,
      border: `1px solid ${error ? components.input.borderError : components.input.border}`,
      boxShadow: components.input.shadow,
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.backgroundColor = components.input.backgroundFocus;
      e.currentTarget.style.borderColor = error ? components.input.borderError : components.input.borderFocus;
      e.currentTarget.style.boxShadow = components.input.shadowFocus;
      props.onFocus?.(e as any);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.backgroundColor = components.input.background;
      e.currentTarget.style.borderColor = error ? components.input.borderError : components.input.border;
      e.currentTarget.style.boxShadow = components.input.shadow;
      props.onBlur?.(e as any);
    };

    return (
      <div className="space-y-2">
        {label && (
          <label 
            className="block text-sm font-medium"
            style={{ color: colors.text.secondary }}
          >
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={baseClasses}
            style={{
              ...inputStyle,
              minHeight: `${rows * 1.5}rem`,
            }}
            rows={rows}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textareaProps}
            {...(props as any)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={baseClasses}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        )}
        {error && (
          <p 
            className="text-sm"
            style={{ color: components.input.borderError }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField'; 