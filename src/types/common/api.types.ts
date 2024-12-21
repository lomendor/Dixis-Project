import { Document } from 'mongoose';

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Λάθος email ή κωδικός',
  UNAUTHORIZED: 'Μη εξουσιοδοτημένη πρόσβαση',
  FORBIDDEN: 'Δεν έχετε δικαίωμα πρόσβασης',
  NOT_FOUND: 'Το στοιχείο δεν βρέθηκε',
  VALIDATION_ERROR: 'Σφάλμα επικύρωσης δεδομένων',
  SERVER_ERROR: 'Εσωτερικό σφάλμα διακομιστή',
  DUPLICATE_EMAIL: 'Το email χρησιμοποιείται ήδη',
  INVALID_TOKEN: 'Μη έγκυρο token',
  EXPIRED_TOKEN: 'Το token έχει λήξει',
} as const;

export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginationData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<PaginationData<T>> {}

export interface ValidationError {
  field: string;
  message: string;
  code: ErrorMessage;
}

export interface ValidationErrorResponse {
  errors: ValidationError[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface QueryParams extends PaginationParams {
  sort?: SortParams;
  filters?: FilterParams;
  search?: string;
}

export interface ApiError {
  code: ErrorMessage;
  message: string;
  details?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

export const API_MESSAGES = {
  SUCCESS: 'Η ενέργεια ολοκληρώθηκε με επιτυχία',
  CREATED: 'Η εγγραφή δημιουργήθηκε με επιτυχία',
  UPDATED: 'Η εγγραφή ενημερώθηκε με επιτυχία',
  DELETED: 'Η εγγραφή διαγράφηκε με επιτυχία',
  NOT_FOUND: 'Η εγγραφή δεν βρέθηκε',
  VALIDATION_ERROR: 'Σφάλμα επικύρωσης δεδομένων',
  UNAUTHORIZED: 'Δεν έχετε πρόσβαση',
  FORBIDDEN: 'Δεν έχετε δικαίωμα πρόσβασης',
  SERVER_ERROR: 'Σφάλμα διακομιστή',
  NETWORK_ERROR: 'Σφάλμα δικτύου',
  UNKNOWN_ERROR: 'Άγνωστο σφάλμα'
} as const;

export const isValidationError = (error: unknown): error is ValidationError => {
  return (error as ValidationError)?.code === ERROR_MESSAGES.VALIDATION_ERROR;
}; 