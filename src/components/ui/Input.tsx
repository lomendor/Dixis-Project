import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:ring-primary-500",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-3",
        md: "h-10 px-4",
        lg: "h-12 text-lg px-6",
      },
      error: {
        true: "border-red-300 focus:border-red-500 focus:ring-red-500",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

export function Input({
  className,
  size,
  error,
  fullWidth,
  label,
  id,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputVariants({ size, error: !!error, fullWidth, className })}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}