// backend/src/routes/authRoutes.js
import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRegistration, validateLogin } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);

export default router;