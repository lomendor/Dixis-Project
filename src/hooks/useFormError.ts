import { useState } from 'react';
import { ApiError } from '@/types/errors';
import { handleFormError } from '@/utils/errorHandling';

export const useFormError = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleError = (error: ApiError) => {
    handleFormError(error, setErrors);
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    handleError,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0
  };
}; 