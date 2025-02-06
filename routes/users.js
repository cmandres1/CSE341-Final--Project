const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate.js'); // Auth middleware
const { validateUser } = require('../middleware/validate.js'); // Validation middleware
const usersController = require('../controllers/users.js'); // Controller for user actions


// Get all users
router.get('/', usersController.getAllUsers);

// Get a single user by ID
router.get('/:id', usersController.getSingleUser);

// Create a new user
router.post('/', isAuthenticated, validateUser,usersController.createUser); // Validate User before creating

// Update a user by ID
router.put('/:id', isAuthenticated, validateUser, usersController.updateUser); // Validate User before updating

// Delete a user by ID
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;