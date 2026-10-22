import config from '../config/env.js';
import { verifyToken } from '../utils/token.js';

/**
 * Authentication middleware verifying HttpOnly JWT cookie
 */
export const authenticate = (req, res, next) => {
  const token = req.cookies?.[config.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. No session cookie found.',
    });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        error: 'Invalid session token.',
      });
    }

    req.user = {
      id: decoded.sub,
      role: decoded.role || 'client',
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session has expired. Please sign in again.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid or corrupted session token.',
    });
  }
};

export default authenticate;
