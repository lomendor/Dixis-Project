import { Router } from 'express';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissionGroups,
  assignUserPermissions,
  getUserPermissions
} from '../controllers/permissionsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/permissionsMiddleware';

const router = Router();

// Προστατευμένες διαδρομές που απαιτούν έλεγχο ταυτότητας
router.use(authMiddleware);

// Διαδρομές για ρόλους
router.get('/roles', checkPermission('read:roles'), getRoles);
router.post('/roles', checkPermission('write:roles'), createRole);
router.put('/roles/:id', checkPermission('write:roles'), updateRole);
router.delete('/roles/:id', checkPermission('delete:roles'), deleteRole);

// Διαδρομές για ομάδες δικαιωμάτων
router.get('/groups', checkPermission('read:permissions'), getPermissionGroups);

// Διαδρομές για δικαιώματα χρηστών
router.get('/users/:userId', checkPermission('read:permissions'), getUserPermissions);
router.post('/users/:userId', checkPermission('write:permissions'), assignUserPermissions);

export default router; 