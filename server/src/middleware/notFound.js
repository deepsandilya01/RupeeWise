/**
 * 404 Not Found middleware for unmatched routes
 */
export const notFound = (req, res, next) => {
  return res.status(404).json({
    success: false,
    error: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

export default notFound;
