interface FormErrorProps {
  error: string | undefined;
  className?: string | undefined;
}

export const FormError = ({ error, className = '' }: FormErrorProps) => {
  if (!error) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`}>
      {error}
    </p>
  );
};

interface FormFieldProps {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
  required?: boolean | undefined;
  className?: string | undefined;
}

export const FormField = ({
  label,
  error,
  children,
  required = false,
  className = ''
}: FormFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <FormError error={error} />
    </div>
  );
}; 