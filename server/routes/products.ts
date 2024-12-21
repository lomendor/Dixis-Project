import { Router } from 'express';
import multer from 'multer';
import { checkPermission } from '../middleware/permissionsMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import * as productController from '../controllers/productController';

const router = Router();

// Multer configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Μόνο εικόνες επιτρέπονται'));
    }
    cb(null, true);
  }
});

// Λίστα προϊόντων
router.get('/', 
  authMiddleware,
  checkPermission('read:products'),
  productController.getProducts
);

// Λεπτομέρειες προϊόντος
router.get('/:id',
  authMiddleware,
  checkPermission('read:products'),
  productController.getProduct
);

// Δημιουργία προϊόντος
router.post('/',
  authMiddleware,
  checkPermission('write:products'),
  upload.array('images', 5), // Επιτρέπει μέχρι 5 εικόνες
  productController.createProduct
);

// Ενημέρωση προϊόντος
router.put('/:id',
  authMiddleware,
  checkPermission('write:products'),
  upload.array('images', 5),
  productController.updateProduct
);

// Διαγραφή προϊόντος
router.delete('/:id',
  authMiddleware,
  checkPermission('delete:products'),
  productController.deleteProduct
);

// Μαζική ενημέρωση προϊόντων
router.post('/bulk-update',
  authMiddleware,
  checkPermission('write:products'),
  productController.bulkUpdateProducts
);

// Εισαγωγή προϊόντων από CSV/Excel
router.post('/import',
  authMiddleware,
  checkPermission('write:products'),
  productController.importProducts
);

export default router; 