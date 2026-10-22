import config from '../config/env.js';

/**
 * Centralized application error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Log error safely without dumping sensitive credentials
  console.error(`[Error] [${req.method} ${req.path}] Status: ${statusCode} - ${err.message}`);

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected server error occurred',
    ...(config.isProduction ? {} : { details: err.stack }),
  });
};

export default errorHandler;
