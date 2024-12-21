// Βασικά permissions
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
  | 'read:roles'
  | 'write:roles'
  | 'delete:roles'
  | 'read:permissions'
  | 'write:permissions'
  | 'admin:*';  // Wildcard permission για admins

// Resource-based permissions
export type ResourcePermission = `${BasicPermission}:${string}`;

// Ιεραρχικά permissions
export type HierarchicalPermission = `${BasicPermission}.*`;

// Time-based permissions
export interface TimeRange {
  start: Date;
  end: Date;
}

// Permission Groups
export interface PermissionGroup {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

// Σύνθετα permissions
export type Permission = BasicPermission | ResourcePermission | HierarchicalPermission;

// Permission rule με conditions και time constraints
export interface PermissionRule {
  permission: Permission;
  condition?: (user: any, resource?: any) => boolean;
  timeRange?: TimeRange;
  groups?: string[];  // Groups που έχουν αυτό το permission
}

// Predefined permission groups
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

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

export type UserRole = 'admin' | 'producer' | 'user';