const express = require('express');
const router  = express.Router();

const { register, login, resendVerification } = require('../controllers/authController');
const { verifyEmail }                         = require('../controllers/verifyController');

router.post('/register',            register);
router.post('/login',               login);
router.get('/verify-email',         verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;