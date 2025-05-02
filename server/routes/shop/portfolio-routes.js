const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const portfolioController = require('../../controllers/shop/portfolio-controller.js');
// Validation middleware
const validatePortfolio = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Valid price is required'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0-5'),
  body('reviews').isInt({ min: 0 }).withMessage('Reviews must be a positive integer'),
  body('sold').isInt({ min: 0 }).withMessage('Sold units must be a positive integer'),
  body('category').isIn(['topRated', 'bestSelling', 'specialCollection']).withMessage('Invalid category'),
  body('craftType').notEmpty().withMessage('Craft type is required'),
  body('materials').isArray({ min: 1 }).withMessage('At least one material is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.get('/', portfolioController.getPortfolios);
router.post('/', validatePortfolio, portfolioController.createPortfolio);
router.put('/:id', validatePortfolio, portfolioController.updatePortfolio);
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;