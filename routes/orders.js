const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate.js'); // Auth middleware
const { validateOrder } = require('../middleware/validate.js'); // Validation middleware
const ordersController = require('../controllers/orders.js'); // Controller for order actions


// Get all orders
router.get('/', ordersController.getAllOrders);

// Get a single order by ID
router.get('/:id', ordersController.getSingleOrder);

// Create a new order
router.post('/', isAuthenticated, validateOrder,ordersController.createOrder); // Validate order before creating

// Update a order by ID
router.put('/:id', isAuthenticated, validateOrder, ordersController.updateOrder); // Validate order before updating

// Delete a order by ID
router.delete('/:id', isAuthenticated, ordersController.deleteOrder);

module.exports = router;