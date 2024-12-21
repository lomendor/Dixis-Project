import { createContext, useContext, useState } from 'react';
import { UserPermissions, UserRole, Permission } from '@/types/auth';

interface PermissionsContextType {
  permissions: UserPermissions;
  userRole: UserRole;
  checkPermission: (resource: keyof UserPermissions, action: keyof Permission) => boolean;
}

const defaultPermissions: UserPermissions = {
  producers: { read: false, write: false, delete: false },
  products: { read: false, write: false, delete: false },
  statistics: { read: false, write: false, delete: false },
  certifications: { read: false, write: false, delete: false }
};

const PermissionsContext = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [userRole] = useState<UserRole>('admin');
  const [permissions] = useState<UserPermissions>(defaultPermissions);
  
  const checkPermission = (resource: keyof UserPermissions, action: keyof Permission) => {
    return permissions[resource][action];
  };

  return (
    <PermissionsContext.Provider value={{ permissions, userRole, checkPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
} 