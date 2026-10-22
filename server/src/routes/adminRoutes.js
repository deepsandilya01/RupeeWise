import express from 'express';
import adminController from '../controllers/adminController.js';
import authenticate from '../middleware/authenticate.js';
import authorizeRole from '../middleware/authorize.js';

const router = express.Router();

// Apply authentication and strict admin role verification to all /api/admin routes
router.use(authenticate, authorizeRole('admin'));

// GET /api/admin/overview - Aggregate platform metrics & recent users
router.get('/overview', adminController.getOverview);

// GET /api/admin/users - Paginated user management directory
router.get('/users', adminController.listUsers);

// PATCH /api/admin/users/:id/role - Update user role (client/admin) with safety guards
router.patch('/users/:id/role', adminController.updateUserRole);

// GET /api/admin/activity - Non-sensitive audit trail of system events
router.get('/activity', adminController.getActivityLogs);

// GET /api/admin/health - Comprehensive system health diagnostics
router.get('/health', adminController.getHealth);

export default router;
