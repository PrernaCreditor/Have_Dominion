const { verifyToken, extractToken } = require('./jwt');
const { AppError } = require('../common/error-handler');

const authMiddleware = (isAdmin = false) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = extractToken(authHeader);
      const decoded = verifyToken(token, isAdmin);

      if (isAdmin && decoded.role !== 'admin') {
        throw new AppError('Admin access required', 403, 'FORBIDDEN');
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

const optionalAuthMiddleware = (isAdmin = false) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = extractToken(authHeader);
        const decoded = verifyToken(token, isAdmin);
        req.user = decoded;
      }
    } catch (error) {
      // Silently ignore auth errors for optional auth
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};