import { Router } from 'express';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissionGroups,
  assignUserPermissions,
  getUserPermissions
} from '../controllers/permissionsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionsMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/roles', checkPermission('read:roles'), getRoles);
router.post('/roles', checkPermission('write:roles'), createRole);
router.put('/roles/:id', checkPermission('write:roles'), updateRole);
router.delete('/roles/:id', checkPermission('delete:roles'), deleteRole);

router.get('/groups', checkPermission('read:permissions'), getPermissionGroups);

router.get('/users/:userId', checkPermission('read:permissions'), getUserPermissions);
router.post('/users/:userId', checkPermission('write:permissions'), assignUserPermissions);

export default router; 