const express = require("express");
// Fix the authentication middleware import to use the correct path
const { authMiddleware } = require("../../controllers/auth/auth-controller");
// OR use the auth middleware directly:
// const authMiddleware = require("../../middleware/auth");
const productController = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", productController.getFilteredProducts);
router.get("/get/:id", productController.getProductDetails);

// Temporarily use existing methods until seller-specific ones are implemented
router.get('/seller', authMiddleware, productController.getFilteredProducts);  // Replace with proper method later
router.post('/', authMiddleware, (req, res) => res.status(501).json({ message: "Not implemented yet" }));
router.put('/:id', authMiddleware, (req, res) => res.status(501).json({ message: "Not implemented yet" }));
router.delete('/:id', authMiddleware, (req, res) => res.status(501).json({ message: "Not implemented yet" }));

module.exports = router;