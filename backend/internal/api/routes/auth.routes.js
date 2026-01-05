const express = require('express');
const router = express.Router();
const { validate } = require('../../common/validation');
const authService = require('../services/auth.service');
const { logger } = require('../../common/logger');

// User Signup
router.post('/user/signup', async (req, res, next) => {
  try {
    const { name, email, password } = validate(req.body, 'userSignup');
    const result = await authService.signupUser(name, email, password);

    logger.info('User signup successful', { email });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// User Login
router.post('/user/login', async (req, res, next) => {
  try {
    const { email, password } = validate(req.body, 'userLogin');
    const result = await authService.loginUser(email, password);

    logger.info('User login successful', { email });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Admin Signup
router.post('/admin/signup', async (req, res, next) => {
  try {
    const { name, email, password, adminSecret } = validate(req.body, 'adminSignup');
    const result = await authService.signupAdmin(name, email, password, adminSecret);

    logger.info('Admin signup successful', { email });
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Admin Login
router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = validate(req.body, 'adminLogin');
    const result = await authService.loginAdmin(email, password);

    logger.info('Admin login successful', { email });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;