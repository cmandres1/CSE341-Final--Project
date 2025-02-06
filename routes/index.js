const router = require('express').Router();
const express = require('express');
const passport = require('passport');

// Define authentication routes first
router.get('/login', passport.authenticate('github'));

// Logout route
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// GitHub OAuth callback route
router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        session: true // Ensure Passport handles session
    }),
    (req, res) => {
        console.log('Logged in user:', req.user); // Debug log to check user object
        res.redirect('/');
    }
);

// Load Swagger documentation after authentication routes
router.use('/', require('./swagger'));

// Register API routes
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/suppliers', require('./suppliers'));

// Home route
router.get('/', (req, res) => {
    let message = '<h1>Welcome to the Inventory Management API</h1>';
    
    if (req.isAuthenticated()) {
        message += `<p>Logged in as ${req.user.displayName || req.user.username}</p>`;
    } else {
        message += '<p>Logged Out. <a href="/login">Login</a></p>';
    }
    
    res.send(message);
});

// Catch-all for unknown routes
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = router;