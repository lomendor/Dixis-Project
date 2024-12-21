export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  details: {
    fields: Record<string, string>;
  };
}

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Σφάλμα επικύρωσης δεδομένων',
  AUTHENTICATION_ERROR: 'Σφάλμα αυθεντικοποίησης',
  AUTHORIZATION_ERROR: 'Δεν έχετε δικαίωμα πρόσβασης',
  NOT_FOUND: 'Το στοιχείο δεν βρέθηκε',
  SERVER_ERROR: 'Σφάλμα διακομιστή',
  NETWORK_ERROR: 'Σφάλμα δικτύου',
  UNKNOWN_ERROR: 'Άγνωστο σφάλμα'
} as const;

export const isValidationError = (error: ApiError): error is ValidationError => {
  return error.code === 'VALIDATION_ERROR';
}; 