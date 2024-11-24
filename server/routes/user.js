import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  exportUserData,
  deleteUserAccount,
  updatePrivacySettings,
} from '../controllers/user.js';

const router = express.Router();

router.get('/data-export', auth, exportUserData);
router.delete('/account', auth, deleteUserAccount);
router.put('/privacy-settings', auth, updatePrivacySettings);

export default router;