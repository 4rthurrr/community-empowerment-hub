const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const applicationController = require('../controllers/applicationController');
const authenticateUser = require('../middleware/auth');

// GET /api/applications/me - Get all applications submitted by the authenticated user
router.get('/me', authenticateUser, applicationController.getMyApplications);

// GET /api/applications/:id - Get a single application by ID
router.get('/:id', authenticateUser, applicationController.getApplicationById);

// PUT /api/applications/:id/status - Update application status (job owner only)
router.put('/:id/status', 
  authenticateUser,
  [
    check('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status value')
  ],
  applicationController.updateApplicationStatus
);

// DELETE /api/applications/:id - Delete/withdraw an application (applicant only)
router.delete('/:id', authenticateUser, applicationController.deleteApplication);

module.exports = router;
