import type { User } from '../../../types/user';

export interface AdminUser extends User {
  permissions: string[];
} 