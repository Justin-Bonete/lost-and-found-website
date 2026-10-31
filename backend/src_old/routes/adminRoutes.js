// backend/src/routes/adminRoutes.js
import express from 'express';
import AdminController from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin, isSuperAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);

// Items management
router.get('/items', AdminController.getAllItems);
router.put('/items/:id/approve', AdminController.approveItem);
router.put('/items/:id/reject', AdminController.rejectItem);

// Users management (admin only)
router.get('/users', isSuperAdmin, AdminController.getAllUsers);
router.put('/users/:id', isSuperAdmin, AdminController.updateUser);

// Claims management
router.get('/claims', AdminController.getAllClaims);
router.put('/claims/:id/process', AdminController.processClaim);

export default router;