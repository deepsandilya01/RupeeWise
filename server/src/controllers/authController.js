import authService from '../services/authService.js';
import { setAuthCookie, clearAuthCookie } from '../utils/token.js';

export const authController = {
  /**
   * Register with Email & Password
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await authService.registerWithEmailPassword({ name, email, password });

      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Login with Email & Password
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.loginWithEmailPassword({ email, password });

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Login into authorized demonstration account (Demo Admin or Demo Client)
   * POST /api/auth/demo
   */
  async loginDemo(req, res, next) {
    try {
      const { role } = req.body;
      const { user, token } = await authService.loginDemoAccount(role);

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Handle Google Login
   * POST /api/auth/google
   */
  async loginWithGoogle(req, res, next) {
    try {
      const { credential } = req.body;
      const { user, token } = await authService.loginWithGoogle(credential);

      // Set HttpOnly, Secure cookie — token is NOT exposed in response JSON
      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get current authenticated user session
   * GET /api/auth/me
   */
  async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await authService.getCurrentUser(userId);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Log out user and clear auth cookie
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      clearAuthCookie(res);
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Admin overview endpoint
   * GET /api/admin/overview
   */
  async getAdminOverview(req, res, next) {
    try {
      const data = await authService.getAdminOverview();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Seed demonstration dataset on demand
   * POST /api/auth/demo/seed
   */
  async seedDemoAccount(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await authService.seedDemoData(userId);
      return res.status(200).json({
        success: true,
        message: 'Demonstration dataset successfully generated',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default authController;
