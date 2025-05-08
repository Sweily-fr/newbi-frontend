import React, { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, fullWidth = false, ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <input
          ref={ref}
          className={classNames(
            'block px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors',
            {
              'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200': !error,
              'border-red-300 focus:border-red-500 focus:ring-red-200': error,
              'w-full': fullWidth,
              'bg-gray-100': props.disabled
            },
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
