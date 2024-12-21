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

// Permission check functions
export type PermissionCheck = (permission: Permission) => boolean;
export type ResourcePermissionCheck = (permission: Permission, resource: any) => boolean;

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

// Helper functions για έλεγχο permissions
export const isWildcardPermission = (permission: Permission): boolean => 
  permission.endsWith('*');

export const matchesWildcard = (permission: Permission, wildcard: Permission): boolean => {
  if (!isWildcardPermission(wildcard)) return false;
  const prefix = wildcard.slice(0, -1); // Αφαιρούμε το *
  return permission.startsWith(prefix);
};

export const isTimeBasedPermissionValid = (rule: PermissionRule): boolean => {
  if (!rule.timeRange) return true;
  const now = new Date();
  return now >= rule.timeRange.start && now <= rule.timeRange.end;
};

export const hasGroupPermission = (
  userGroups: string[], 
  rule: PermissionRule
): boolean => {
  if (!rule.groups || rule.groups.length === 0) return true;
  return userGroups.some(group => rule.groups?.includes(group));
};

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type UserRole = 'admin' | 'producer' | 'user';

export interface PermissionMap {
  [key: string]: {
    label: string;
    description: string;
    group: 'dashboard' | 'producers' | 'products' | 'orders' | 'users' | 'settings';
  }
}

export const PERMISSIONS: PermissionMap = {
  'view:dashboard': {
    label: 'Προβολή Dashboard',
    description: 'Δυνατότητα προβολής του dashboard',
    group: 'dashboard'
  },
  'manage:producers': {
    label: 'Διαχείριση Παραγωγών',
    description: 'Πλήρης διαχείριση παραγωγών',
    group: 'producers'
  },
  'view:producers': {
    label: 'Προβολή Παραγωγών',
    description: 'Προβολή λίστας παραγωγών',
    group: 'producers'
  },
  // ... περισσότερα permissions
}; 