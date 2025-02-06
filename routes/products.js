const express = require('express');
const router = express.Router();
const { validateProduct } = require('../middleware/validate.js'); // Validation middleware
const productsController = require('../controllers/products.js'); // Controller for product actions
const { isAuthenticated } = require('../middleware/authenticate.js'); // Auth middleware

// Get all producterinarians
router.get('/', productsController.getAllProducts);

// Get a single producterinarian by ID
router.get('/:id', productsController.getSingleProduct);

// Create a new producterinarian
router.post('/', isAuthenticated , validateProduct, productsController.createProduct); // Validate product before creating

// Update a producterinarian by ID
router.put('/:id', isAuthenticated , validateProduct, productsController.updateProduct); // Validate product before updating

// Delete a producterinarian by ID
router.delete('/:id', isAuthenticated , productsController.deleteProduct);

module.exports = router;