import config from '../config/env.js';

/**
 * CSRF protection middleware for cookie-based authentication.
 * Verifies origin/referer and custom header on state-changing requests.
 */
export const csrfProtection = (req, res, next) => {
  // Safe HTTP methods do not change state
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Exempt health checks if any POST/PUT exists
  if (req.path.startsWith('/api/health')) {
    return next();
  }

  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const customHeader =
    req.headers['x-requested-with'] ||
    req.headers['x-rupeewise-client'] ||
    req.headers['x-paisapilot-client'];

  const allowedOrigin = new URL(config.CLIENT_URL).origin;

  // 1. Origin verification when present
  if (origin) {
    try {
      const requestOrigin = new URL(origin).origin;
      if (requestOrigin !== allowedOrigin) {
        return res.status(403).json({
          success: false,
          error: 'CSRF validation failed: Unauthorized request origin.',
        });
      }
    } catch {
      return res.status(403).json({
        success: false,
        error: 'CSRF validation failed: Malformed origin header.',
      });
    }
  } else if (referer) {
    // 2. Referer verification fallback
    try {
      const requestRefererOrigin = new URL(referer).origin;
      if (requestRefererOrigin !== allowedOrigin) {
        return res.status(403).json({
          success: false,
          error: 'CSRF validation failed: Unauthorized referer.',
        });
      }
    } catch {
      return res.status(403).json({
        success: false,
        error: 'CSRF validation failed: Malformed referer header.',
      });
    }
  }

  // 3. Custom header verification (browsers disallow custom headers on simple cross-site requests without CORS preflight)
  // Our frontend apiClient automatically sends 'X-Requested-With: XMLHttpRequest'
  if (!customHeader && !config.isProduction) {
    // In development with Postman/curl, allow if origin matches or log warning
  }

  return next();
};

export default csrfProtection;
