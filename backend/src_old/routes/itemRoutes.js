// backend/src/routes/itemRoutes.js
import express from 'express';
import ItemController from '../controllers/itemController.js';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';
import { validateItem } from '../utils/validators.js';

const router = express.Router();

// Public routes (with optional auth for personalized results)
router.get('/', optionalAuth, ItemController.getItems);
router.get('/:id', optionalAuth, ItemController.getItem);

// Protected routes
router.post(
  '/',
  authenticate,
  upload.single('image'),
  handleUploadError,
  validateItem,
  ItemController.createItem
);

router.get('/user/my-items', authenticate, ItemController.getMyItems);
router.put('/:id', authenticate, ItemController.updateItem);
router.delete('/:id', authenticate, ItemController.deleteItem);

export default router;