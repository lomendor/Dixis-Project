import { toast } from 'react-hot-toast';
import { ApiError, ValidationError, ERROR_MESSAGES, API_MESSAGES } from '@/types/common/api.types';
import { AxiosError } from 'axios';

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    if (apiError?.code) {
      return apiError;
    }

    if (error.response?.status === 401) {
      return {
        code: ERROR_MESSAGES.UNAUTHORIZED,
        message: API_MESSAGES.UNAUTHORIZED
      };
    }

    if (error.response?.status === 403) {
      return {
        code: ERROR_MESSAGES.FORBIDDEN,
        message: API_MESSAGES.FORBIDDEN
      };
    }

    if (error.response?.status === 404) {
      return {
        code: ERROR_MESSAGES.NOT_FOUND,
        message: API_MESSAGES.NOT_FOUND
      };
    }

    if (!error.response) {
      return {
        code: ERROR_MESSAGES.SERVER_ERROR,
        message: API_MESSAGES.NETWORK_ERROR
      };
    }
  }

  return {
    code: ERROR_MESSAGES.SERVER_ERROR,
    message: API_MESSAGES.UNKNOWN_ERROR
  };
};

export const showErrorToast = (error: ApiError) => {
  if (error.details && 'fields' in error.details) {
    Object.values(error.details.fields as Record<string, string>).forEach(message => {
      toast.error(message);
    });
  } else {
    toast.error(error.message);
  }
};

export const handleFormError = (error: ApiError, setErrors?: (errors: Record<string, string>) => void) => {
  if (error.details && 'fields' in error.details && setErrors) {
    setErrors(error.details.fields as Record<string, string>);
  } else {
    showErrorToast(error);
  }
}; 