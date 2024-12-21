import { PermissionGroup, Permission } from '../types/permissions';

// Βασικές ομάδες δικαιωμάτων
export const PERMISSION_GROUPS: Record<string, PermissionGroup> = {
  'admin': {
    id: 'admin',
    name: 'Διαχειριστής',
    permissions: ['admin:*'],
    description: 'Πλήρη δικαιώματα διαχείρισης'
  },
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

// Default permissions για κάθε ρόλο
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  'admin': ['admin:*'],
  'producer': ['read:products', 'write:products', 'read:orders'],
  'user': ['read:products']
};

// Ιεραρχία δικαιωμάτων
export const PERMISSION_HIERARCHY: Record<string, string[]> = {
  'admin:*': ['*'],
  'write:*': ['read:*'],
  'delete:*': ['write:*', 'read:*']
};

// Απαιτούμενα δικαιώματα για κάθε endpoint
export const ENDPOINT_PERMISSIONS = {
  // Products
  'GET /api/products': ['read:products'],
  'POST /api/products': ['write:products'],
  'PUT /api/products/:id': ['write:products'],
  'DELETE /api/products/:id': ['delete:products'],
  
  // Orders
  'GET /api/orders': ['read:orders'],
  'POST /api/orders': ['write:orders'],
  'PUT /api/orders/:id': ['write:orders'],
  'DELETE /api/orders/:id': ['delete:orders'],
  
  // Users
  'GET /api/users': ['read:users'],
  'POST /api/users': ['write:users'],
  'PUT /api/users/:id': ['write:users'],
  'DELETE /api/users/:id': ['delete:users'],
  
  // Producers
  'GET /api/producers': ['read:producers'],
  'POST /api/producers': ['write:producers'],
  'PUT /api/producers/:id': ['write:producers'],
  'DELETE /api/producers/:id': ['delete:producers']
} as const; 