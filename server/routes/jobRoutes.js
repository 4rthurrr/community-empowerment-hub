const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const { authMiddleware } = require('../controllers/auth/auth-controller');

// Job Routes
// GET /api/jobs - Get all jobs (public)
router.get('/', jobController.getAllJobs);

// GET /api/jobs/user/me - Get all jobs posted by the authenticated user (auth required)
// IMPORTANT: This specific route must come BEFORE the :id parameterized route
router.get('/user/me', authMiddleware, jobController.getMyJobs);

// GET /api/jobs/:id - Get a single job by ID (public)
router.get('/:id', jobController.getJobById);

// POST /api/jobs - Create a new job (auth required)
router.post('/', 
  authMiddleware,
  [
    check('jobTitle')
      .trim()
      .notEmpty().withMessage('Job title is required')
      .isLength({ min: 3 }).withMessage('Job title must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Job title must be less than 100 characters'),
    check('companyName')
      .trim()
      .notEmpty().withMessage('Organization name is required')
      .isLength({ min: 3 }).withMessage('Organization name must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Organization name must be less than 100 characters'),
    check('location')
      .trim()
      .notEmpty().withMessage('Location is required')
      .isLength({ min: 2 }).withMessage('Location must be at least 2 characters')
      .isLength({ max: 50 }).withMessage('Location must be less than 50 characters'),
    check('salary')
      .optional({ nullable: true })
      .isInt({ min: 0, max: 1000000 }).withMessage('Salary must be a positive number less than 1,000,000'),
    check('jobDescription')
      .trim()
      .notEmpty().withMessage('Job description is required')
      .isLength({ min: 50 }).withMessage('Job description must be at least 50 characters')
      .isLength({ max: 1000 }).withMessage('Job description must be less than 1000 characters'),
    check('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['Trades', 'Crafts', 'Agriculture', 'Education', 'Healthcare', 'Culinary'])
      .withMessage('Invalid category selected')
  ],
  jobController.createJob
);

// PUT /api/jobs/:id - Update a job (auth required)
router.put('/:id', 
  authMiddleware,
  [
    check('jobTitle')
      .trim()
      .notEmpty().withMessage('Job title is required')
      .isLength({ min: 3 }).withMessage('Job title must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Job title must be less than 100 characters'),
    check('companyName')
      .trim()
      .notEmpty().withMessage('Organization name is required')
      .isLength({ min: 3 }).withMessage('Organization name must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Organization name must be less than 100 characters'),
    check('location')
      .trim()
      .notEmpty().withMessage('Location is required')
      .isLength({ min: 2 }).withMessage('Location must be at least 2 characters')
      .isLength({ max: 50 }).withMessage('Location must be less than 50 characters'),
    check('salary')
      .optional({ nullable: true })
      .isInt({ min: 0, max: 1000000 }).withMessage('Salary must be a positive number less than 1,000,000'),
    check('jobDescription')
      .trim()
      .notEmpty().withMessage('Job description is required')
      .isLength({ min: 50 }).withMessage('Job description must be at least 50 characters')
      .isLength({ max: 1000 }).withMessage('Job description must be less than 1000 characters'),
    check('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['Trades', 'Crafts', 'Agriculture', 'Education', 'Healthcare', 'Culinary'])
      .withMessage('Invalid category selected')
  ],
  jobController.updateJob
);

// DELETE /api/jobs/:id - Delete a job (auth required)
router.delete('/:id', authMiddleware, jobController.deleteJob);

// GET /api/jobs/:jobId/applications - Get all applications for a job (auth required, job owner only)
router.get('/:jobId/applications', authMiddleware, jobController.getJobApplications);

// Application Routes
// POST /api/jobs/:jobId/applications - Apply for a job (auth required)
router.post('/:jobId/applications', 
  authMiddleware,
  [
    check('applicantName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 3 }).withMessage('Name must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
      .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name contains invalid characters'),
    check('email')
      .trim()
      .notEmpty().withMessage('Email address is required')
      .isEmail().withMessage('Please enter a valid email address'),
    check('phone')
      .trim()
      .notEmpty().withMessage('Phone number is required')
      .matches(/^0[0-9]{9}$|^\+94[0-9]{9}$|^07[0-9]-[0-9]{3}-[0-9]{4}$/)
      .withMessage('Please enter a valid Sri Lankan phone number'),
    check('experience')
      .trim()
      .notEmpty().withMessage('Experience information is required')
      .isLength({ min: 20 }).withMessage('Experience details must be at least 20 characters')
      .isLength({ max: 500 }).withMessage('Experience details must be less than 500 characters'),
    check('coverLetter')
      .trim()
      .notEmpty().withMessage('Cover letter is required')
      .isLength({ min: 50 }).withMessage('Cover letter must be at least 50 characters')
      .isLength({ max: 1000 }).withMessage('Cover letter must be less than 1000 characters'),
    check('resume')
      .optional()
      .isURL().withMessage('Resume must be a valid URL or file path')
  ],
  applicationController.createApplication
);

module.exports = router;
