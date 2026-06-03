const crypto  = require('crypto');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { sendVerificationEmail } = require('./mailService');

const generateVerificationToken = () => ({
    token:     crypto.randomBytes(32).toString('hex'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
});

const registerUser = async (email, password) => {
    const existing = await User.query().findOne({ email });
    if (existing) {
        const error = new Error('Email is already in use.');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const { token, expiresAt } = generateVerificationToken();

    const user = await User.query().insertAndFetch({
        email,
        password:                      hashedPassword,
        is_verified:                   false,
        verification_token:            token,
        verification_token_expires_at: expiresAt
    });

    const username = email.split('@')[0];
    await user.$relatedQuery('userInfo').insert({ username });

    try {
        await sendVerificationEmail(email, username, token);
    } catch (mailError) {
        console.error('[mailService] Failed to send verification email:', mailError.message);
    }

    return user;
};

const loginUser = async (email, password) => {
    const user = await User.query().findOne({ email });

    if (!user) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    if (!user.is_verified) {
        const error = new Error('Please verify your email before logging in.');
        error.statusCode = 403;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return token;
};

const verifyEmail = async (token) => {
    const user = await User.query().findOne({ verification_token: token });

    if (!user) {
        const error = new Error('Invalid or expired verification token.');
        error.statusCode = 400;
        throw error;
    }

    if (new Date() > new Date(user.verification_token_expires_at)) {
        const error = new Error('Verification token has expired. Please request a new one.');
        error.statusCode = 400;
        throw error;
    }

    if (user.is_verified) {
        const error = new Error('Account is already verified.');
        error.statusCode = 400;
        throw error;
    }

    await User.query().patchAndFetchById(user.id, {
        is_verified:                   true,
        verification_token:            null,
        verification_token_expires_at: null
    });
};

const resendVerificationEmail = async (email) => {
    const user = await User.query()
        .findOne({ email })
        .withGraphFetched('userInfo');

    if (!user) return;

    if (user.is_verified) {
        const error = new Error('Account is already verified.');
        error.statusCode = 400;
        throw error;
    }

    const { token, expiresAt } = generateVerificationToken();

    await User.query().patchAndFetchById(user.id, {
        verification_token:            token,
        verification_token_expires_at: expiresAt
    });

    const username = user.userInfo?.username || email.split('@')[0];
    await sendVerificationEmail(email, username, token);
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationEmail
};