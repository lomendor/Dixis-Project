import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'icon' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({
  className,
  variant = 'solid',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
        'disabled:opacity-50 disabled:pointer-events-none',
        {
          // Solid variant
          'bg-emerald-600 text-white hover:bg-emerald-700': variant === 'solid',
          
          // Outline variant
          'border-2 border-gray-200 hover:border-gray-300 text-gray-700': variant === 'outline',
          
          // Icon variant
          'p-2 text-gray-600 hover:bg-gray-100 rounded-full': variant === 'icon',

          // Ghost variant
          'text-gray-600 hover:bg-gray-100': variant === 'ghost',
          
          // Sizes
          'h-10 px-4 py-2': size === 'default',
          'h-9 px-3': size === 'sm',
          'h-11 px-8': size === 'lg',
          'w-10 h-10': size === 'icon',
        },
        className
      )}
      {...props}
    />
  );
}