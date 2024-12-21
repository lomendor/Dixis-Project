import { toast } from 'react-hot-toast';
import { ApiError, ERROR_MESSAGES, isValidationError } from '@/types/errors';
import { AxiosError } from 'axios';

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    if (apiError?.code) {
      return apiError;
    }

    if (error.response?.status === 401) {
      return {
        code: 'AUTHENTICATION_ERROR',
        message: ERROR_MESSAGES.AUTHENTICATION_ERROR
      };
    }

    if (error.response?.status === 403) {
      return {
        code: 'AUTHORIZATION_ERROR',
        message: ERROR_MESSAGES.AUTHORIZATION_ERROR
      };
    }

    if (error.response?.status === 404) {
      return {
        code: 'NOT_FOUND',
        message: ERROR_MESSAGES.NOT_FOUND
      };
    }

    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR
      };
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: ERROR_MESSAGES.UNKNOWN_ERROR
  };
};

export const showErrorToast = (error: ApiError) => {
  if (isValidationError(error)) {
    Object.values(error.details.fields).forEach(message => {
      toast.error(message);
    });
  } else {
    toast.error(error.message);
  }
};

export const handleFormError = (error: ApiError, setErrors?: (errors: Record<string, string>) => void) => {
  if (isValidationError(error) && setErrors) {
    setErrors(error.details.fields);
  } else {
    showErrorToast(error);
  }
}; 