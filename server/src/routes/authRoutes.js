import express from 'express';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import {
  validateBody,
  googleAuthSchema,
  registerSchema,
  loginSchema,
  demoAuthSchema,
} from '../middleware/validate.js';

const router = express.Router();

// Rate limiting for auth endpoints (max 30 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register - Register with name, email, password
router.post('/register', authLimiter, validateBody(registerSchema), authController.register);

// POST /api/auth/login - Sign in with email, password
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);

// POST /api/auth/demo - Sign in to authorized demo account (Demo Admin / Demo Client)
router.post('/demo', authLimiter, validateBody(demoAuthSchema), authController.loginDemo);

// POST /api/auth/google - Authenticate with Google ID credential
router.post('/google', authLimiter, validateBody(googleAuthSchema), authController.loginWithGoogle);

// GET /api/auth/me - Get current user profile and role from HttpOnly cookie
router.get('/me', authenticate, authController.getCurrentUser);

// POST /api/auth/logout - Clear session cookie
router.post('/logout', authController.logout);

export default router;
