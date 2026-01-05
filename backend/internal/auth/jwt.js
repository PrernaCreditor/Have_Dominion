const jwt = require('jsonwebtoken');
const { AppError } = require('../common/error-handler');
const { logger } = require('../common/logger');

const generateToken = (payload, isAdmin = false) => {
  const secret = isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET;
  const expiresIn = isAdmin ? '7d' : '7d';

  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    logger.error('Token generation failed', { error: error.message });
    throw new AppError('Failed to generate token', 500, 'TOKEN_GENERATION_ERROR');
  }
};

const verifyToken = (token, isAdmin = false) => {
  const secret = isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }
    throw new AppError('Token verification failed', 401, 'TOKEN_VERIFICATION_ERROR');
  }
};

const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Missing or invalid authorization header', 401, 'MISSING_TOKEN');
  }
  return authHeader.substring(7);
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
};