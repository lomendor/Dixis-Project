import { Request, Response, NextFunction } from 'express';
import { Permission } from '../types/permissions';
import { PERMISSION_HIERARCHY } from '../constants/permissions';

// Έλεγχος αν ένα permission ταιριάζει με wildcard
const matchesWildcard = (permission: string, wildcard: string): boolean => {
  if (!wildcard.includes('*')) return permission === wildcard;
  const prefix = wildcard.replace('*', '');
  return permission.startsWith(prefix);
};

// Έλεγχος αν ο χρήστης έχει το συγκεκριμένο permission
export const hasPermission = (userPermissions: Permission[], requiredPermission: Permission): boolean => {
  // Admin έχει πρόσβαση παντού
  if (userPermissions.includes('admin:*')) return true;

  // Έλεγχος για ιεραρχικά permissions
  for (const userPerm of userPermissions) {
    // Άμεσο ταίριασμα
    if (userPerm === requiredPermission) return true;

    // Έλεγχος wildcard
    if (matchesWildcard(requiredPermission, userPerm)) return true;

    // Έλεγχος ιεραρχίας
    const hierarchyPermissions = PERMISSION_HIERARCHY[userPerm];
    if (hierarchyPermissions?.some(p => matchesWildcard(requiredPermission, p))) {
      return true;
    }
  }

  return false;
};

// Middleware για έλεγχο permissions
export const checkPermission = (requiredPermission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userPermissions = req.user?.permissions || [];
      
      if (!hasPermission(userPermissions, requiredPermission)) {
        res.status(403).json({ 
          error: 'Δεν έχετε τα απαραίτητα δικαιώματα για αυτή την ενέργεια' 
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 