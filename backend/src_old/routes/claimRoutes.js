// backend/src/routes/claimRoutes.js
import express from 'express';
import ClaimController from '../controllers/claimController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', ClaimController.createClaim);
router.get('/my-claims', ClaimController.getMyClaims);
router.get('/item/:itemId', ClaimController.getItemClaims);
router.get('/:id', ClaimController.getClaim);

export default router;