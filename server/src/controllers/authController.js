import authService from '../services/authService.js';
import { setAuthCookie, clearAuthCookie } from '../utils/token.js';

export const authController = {
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
};

export default authController;
