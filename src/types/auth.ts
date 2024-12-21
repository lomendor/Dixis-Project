export type UserRole = 'admin' | 'seller' | 'producer';

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface UserPermissions {
  producers: Permission;
  products: Permission;
  statistics: Permission;
  certifications: Permission;
} 