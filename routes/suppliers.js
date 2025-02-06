const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate.js'); // Auth middleware
const { validateSupplier } = require('../middleware/validate.js'); // Validation middleware
const suppliersController = require('../controllers/suppliers.js'); // Controller for supplier actions


// Get all suppliers
router.get('/', suppliersController.getAllSuppliers);

// Get a single supplier by ID
router.get('/:id', suppliersController.getSingleSupplier);

// Create a new supplier
router.post('/', isAuthenticated, validateSupplier,suppliersController.createSupplier); // Validate supplier before creating

// Update a supplier by ID
router.put('/:id', isAuthenticated, validateSupplier, suppliersController.updateSupplier); // Validate supplier before updating

// Delete a supplier by ID
router.delete('/:id', isAuthenticated, suppliersController.deleteSupplier);

module.exports = router;