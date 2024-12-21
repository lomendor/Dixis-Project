// Basic Permission Types
export enum Permission {
  // User permissions
  ViewUsers = 'view_users',
  CreateUsers = 'create_users',
  UpdateUsers = 'update_users',
  DeleteUsers = 'delete_users',
  ManageUserRoles = 'manage_user_roles',

  // Product permissions
  ViewProducts = 'view_products',
  CreateProducts = 'create_products',
  UpdateProducts = 'update_products',
  DeleteProducts = 'delete_products',
  ManageProductCategories = 'manage_product_categories',

  // Order permissions
  ViewOrders = 'view_orders',
  CreateOrders = 'create_orders',
  UpdateOrders = 'update_orders',
  DeleteOrders = 'delete_orders',
  ManageOrderStatus = 'manage_order_status',

  // Producer permissions
  ViewProducers = 'view_producers',
  CreateProducers = 'create_producers',
  UpdateProducers = 'update_producers',
  DeleteProducers = 'delete_producers',
  ManageProducerProducts = 'manage_producer_products',

  // System permissions
  ViewSystemSettings = 'view_system_settings',
  UpdateSystemSettings = 'update_system_settings',
  ViewAnalytics = 'view_analytics',
  ManagePermissions = 'manage_permissions'
}

export enum Role {
  Admin = 'admin',
  User = 'user',
  Producer = 'producer',
  Staff = 'staff'
}

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Admin]: Object.values(Permission),
  [Role.User]: [
    Permission.ViewProducts,
    Permission.CreateOrders,
    Permission.ViewOrders
  ],
  [Role.Producer]: [
    Permission.ViewProducts,
    Permission.CreateProducts,
    Permission.UpdateProducts,
    Permission.DeleteProducts,
    Permission.ViewOrders,
    Permission.ManageProducerProducts
  ],
  [Role.Staff]: [
    Permission.ViewUsers,
    Permission.ViewProducts,
    Permission.ViewOrders,
    Permission.UpdateOrders,
    Permission.ManageOrderStatus,
    Permission.ViewAnalytics
  ]
};

// Permission Groups
export interface PermissionGroup {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
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
    permissions: [
      Permission.ViewProducts,
      Permission.CreateProducts,
      Permission.UpdateProducts,
      Permission.DeleteProducts,
      Permission.ManageProductCategories
    ],
    description: 'Διαχείριση προϊόντων'
  },
  'orders': {
    id: 'orders',
    name: 'Παραγγελίες',
    permissions: [
      Permission.ViewOrders,
      Permission.CreateOrders,
      Permission.UpdateOrders,
      Permission.DeleteOrders,
      Permission.ManageOrderStatus
    ],
    description: 'Διαχείριση παραγγελιών'
  },
  'users': {
    id: 'users',
    name: 'Χρήστες',
    permissions: [
      Permission.ViewUsers,
      Permission.CreateUsers,
      Permission.UpdateUsers,
      Permission.DeleteUsers,
      Permission.ManageUserRoles
    ],
    description: 'Διαχείριση χρηστών'
  },
  'producers': {
    id: 'producers',
    name: 'Παραγωγοί',
    permissions: [
      Permission.ViewProducers,
      Permission.CreateProducers,
      Permission.UpdateProducers,
      Permission.DeleteProducers,
      Permission.ManageProducerProducts
    ],
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