import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { useThemeJson } from '../hooks/useThemeJson';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false, 
    loading = false,
    children, 
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const { getComponent, spacing } = useThemeJson();
    const buttonStyles = getComponent(`button.${variant}`);

    const sizeClasses = {
      sm: `px-3 py-2 text-sm`,
      md: `px-6 py-3 text-base`,
      lg: `px-8 py-4 text-lg`,
    };

    const baseClasses = `
      font-medium rounded-xl transition-all duration-200 backdrop-blur-sm
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <button
        ref={ref}
        className={baseClasses}
        style={{
          backgroundColor: buttonStyles.background,
          color: buttonStyles.text,
          border: `1px solid ${buttonStyles.border}`,
          boxShadow: buttonStyles.shadow,
        }}
        disabled={disabled || loading}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = buttonStyles.backgroundHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = buttonStyles.background;
          }
        }}
        onMouseDown={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = buttonStyles.backgroundPressed;
          }
        }}
        onMouseUp={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = buttonStyles.backgroundHover;
          }
        }}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button'; 