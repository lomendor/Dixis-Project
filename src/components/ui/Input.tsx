import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="relative space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors",
              "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error 
                ? "border-red-300 text-red-900 placeholder-red-300 focus-visible:ring-red-500 pr-10" 
                : "border-gray-200 focus-visible:ring-gray-950",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.name}-error` : undefined}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>
        {error && (
          <div
            className="mt-1.5 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-200"
            id={`${props.name}-error`}
            role="alert"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };