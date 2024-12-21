import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          'animate-spin rounded-full border-b-2 border-emerald-600',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Φόρτωση..."
      >
        <span className="sr-only">Φόρτωση...</span>
      </div>
    </div>
  );
} 