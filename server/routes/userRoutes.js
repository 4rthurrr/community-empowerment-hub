const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../controllers/auth/auth-controller');

// GET /api/user/me - Get current user profile
router.get('/me', authMiddleware, userController.getUserProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', 
  authMiddleware,
  [
    check('userName')
      .optional()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    check('email')
      .optional()
      .isEmail()
      .withMessage('Please include a valid email'),
    check('phone')
      .optional()
      .matches(/^0[0-9]{9}$|^\+94[0-9]{9}$|^07[0-9]-[0-9]{3}-[0-9]{4}$/)
      .withMessage('Please enter a valid Sri Lankan phone number'),
    check('bio')
      .optional()
      .isLength({ max: 300 })
      .withMessage('Bio must be less than 300 characters')
  ],
  userController.updateUserProfile
);

// PUT /api/user/password - Update password
router.put('/password',
  authMiddleware,
  [
    check('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    check('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must include uppercase, lowercase, and numbers')
  ],
  userController.updatePassword
);

// PUT /api/user/deactivate - Deactivate account
router.put('/deactivate', authMiddleware, userController.deactivateAccount);

module.exports = router;
