// Basic Permission Types
export type BasicPermission = 
  | 'read:products'
  | 'write:products'
  | 'delete:products'
  | 'read:orders'
  | 'write:orders'
  | 'delete:orders'
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:producers'
  | 'write:producers'
  | 'delete:producers'
  | 'admin:*';

// Permission Variants
export type ResourcePermission = `${BasicPermission}:${string}`;
export type HierarchicalPermission = `${BasicPermission}.*`;
export type Permission = BasicPermission | ResourcePermission | HierarchicalPermission;

// Permission Groups
export interface PermissionGroup {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

// Role Types
export type UserRole = 'admin' | 'producer' | 'user';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// Permission Map for UI
export interface PermissionMap {
  [key: string]: {
    label: string;
    description: string;
    group: 'dashboard' | 'producers' | 'products' | 'orders' | 'users' | 'settings';
  }
}

// Predefined Permission Groups
export const PERMISSION_GROUPS: Record<string, PermissionGroup> = {
  'products': {
    id: 'products',
    name: 'Προϊόντα',
    permissions: ['read:products', 'write:products', 'delete:products'],
    description: 'Διαχείριση προϊόντων'
  },
  'orders': {
    id: 'orders',
    name: 'Παραγγελίες',
    permissions: ['read:orders', 'write:orders', 'delete:orders'],
    description: 'Διαχείριση παραγγελιών'
  },
  'users': {
    id: 'users',
    name: 'Χρήστες',
    permissions: ['read:users', 'write:users', 'delete:users'],
    description: 'Διαχείριση χρηστών'
  },
  'producers': {
    id: 'producers',
    name: 'Παραγωγοί',
    permissions: ['read:producers', 'write:producers', 'delete:producers'],
    description: 'Διαχείριση παραγωγών'
  }
};

// Permission Utilities
export const isWildcardPermission = (permission: Permission): boolean => 
  permission.endsWith('*');

export const matchesWildcard = (permission: Permission, wildcard: Permission): boolean => {
  if (!isWildcardPermission(wildcard)) return false;
  const prefix = wildcard.slice(0, -1);
  return permission.startsWith(prefix);
}; 