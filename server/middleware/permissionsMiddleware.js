import { PERMISSION_HIERARCHY } from '../constants/permissions.js';

// Έλεγχος αν ένα permission ταιριάζει με wildcard
const matchesWildcard = (permission, wildcard) => {
  if (!wildcard.includes('*')) return permission === wildcard;
  const prefix = wildcard.replace('*', '');
  return permission.startsWith(prefix);
};

// Έλεγχος αν ο χρήστης έχει το συγκεκριμένο permission
export const hasPermission = (userPermissions, requiredPermission) => {
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
export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
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