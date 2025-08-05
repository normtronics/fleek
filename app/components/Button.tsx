import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

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
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
      primary: 'bg-surface-secondary hover:bg-surface-tertiary active:bg-surface-variant text-text-primary border-border-primary',
      secondary: 'bg-surface-secondary hover:bg-surface-tertiary active:bg-surface-variant text-text-primary border-border-primary',
      tertiary: 'bg-transparent hover:bg-surface-primary active:bg-surface-secondary text-text-primary border-border-primary',
      ghost: 'bg-transparent hover:bg-surface-primary active:bg-surface-secondary text-text-secondary border-transparent',
    };

    const baseClasses = `
      font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
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