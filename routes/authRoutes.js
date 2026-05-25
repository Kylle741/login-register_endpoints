const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Register a user by splitting auth data and profile data across the two tables.
router.post('/register', register);

// Authenticate a user and return the related user_info record with the auth user.
router.post('/login', login);

module.exports = router;
