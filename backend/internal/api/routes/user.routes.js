const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../auth/middleware');
const { validate } = require('../../common/validation');
const userService = require('../services/user.service');
const { logger } = require('../../common/logger');

// Get user profile (requires authentication)
router.get('/profile', authMiddleware(false), async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);

    logger.info('User profile fetched', { userId: req.user.id });
    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile (requires authentication)
router.put('/profile', authMiddleware(false), async (req, res, next) => {
  try {
    const updateData = validate(req.body, 'updateUser');
    const user = await userService.updateUser(req.user.id, updateData);

    logger.info('User profile updated', { userId: req.user.id });
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID (requires authentication)
router.get('/:userId', authMiddleware(false), async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.userId);

    logger.info('User fetched', { userId: req.params.userId });
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Delete user account (requires authentication)
router.delete('/profile', authMiddleware(false), async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.user.id);

    logger.info('User account deleted', { userId: req.user.id });
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;