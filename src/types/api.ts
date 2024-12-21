export interface PaginationParams {
  page: number;
  limit: number;
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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

export type ApiError = {
  code: string;
  message: string;
  field?: string;
};

export interface ValidationError extends ErrorResponse {
  errors: ApiError[];
}

// Common status codes and their messages
export const API_MESSAGES = {
  SUCCESS: 'Η ενέργεια ολοκληρώθηκε με επιτυχία',
  CREATED: 'Η εγγραφή δημιουργήθηκε με επιτυχία',
  UPDATED: 'Η εγγραφή ενημερώθηκε με επιτυχία',
  DELETED: 'Η εγγραφή διαγράφηκε με επιτυχία',
  NOT_FOUND: 'Η εγγραφή δεν βρέθηκε',
  VALIDATION_ERROR: 'Σφάλμα επικύρωσης δεδομένων',
  UNAUTHORIZED: 'Δεν έχετε πρόσβαση',
  FORBIDDEN: 'Δεν έχετε δικαίωμα πρόσβασης',
  SERVER_ERROR: 'Σφάλμα διακομιστή'
} as const; 