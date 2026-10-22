import express from 'express';
import authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import authorizeRole from '../middleware/authorize.js';

const router = express.Router();

// GET /api/admin/overview - Admin only dashboard overview
router.get('/overview', authenticate, authorizeRole('admin'), authController.getAdminOverview);

export default router;
