import config from '../config/env.js';
import userRepository from '../repositories/userRepository.js';

/**
 * Role-Based Access Control middleware factory
 * @param  {...string} allowedRoles - e.g. 'admin', 'client'
 */
export const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required.',
      });
    }

    // If route requires admin, verify with live allowlist to support instant revocation
    if (allowedRoles.includes('admin')) {
      try {
        const user = await userRepository.findById(req.user.id);
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'User account not found.',
          });
        }

        const isAllowedAdmin = config.isAdminEmail(user.email);
        if (!isAllowedAdmin) {
          // Immediately revoke stored admin role if removed from allowlist
          if (user.role === 'admin') {
            await userRepository.updateById(user._id, { role: 'client' });
            req.user.role = 'client';
          }

          return res.status(403).json({
            success: false,
            error: 'Forbidden: Access is restricted to authorized administrators.',
          });
        }

        // Ensure user document has admin role
        if (user.role !== 'admin') {
          await userRepository.updateById(user._id, { role: 'admin' });
        }

        req.user.role = 'admin';
        return next();
      } catch (error) {
        return next(error);
      }
    }

    // Standard role check for other roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient privileges to access this resource.',
      });
    }

    return next();
  };
};

export default authorizeRole;
