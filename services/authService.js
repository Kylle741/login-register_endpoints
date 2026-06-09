const crypto            = require('crypto');
const bcrypt            = require('bcrypt');
const jwt               = require('jsonwebtoken');
const User              = require('../models/User');
const Role              = require('../models/Role');
const EmailVerification = require('../models/EmailVerification');
const { sendVerificationEmail } = require('./mailService');

const VALID_ROLES = ['admin', 'staff', 'member'];

const generateVerificationToken = () => ({
    token:     crypto.randomBytes(32).toString('hex'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
});

const registerUser = async ({ first_name, middle_name, last_name, email, password, role }) => {
    const existing = await User.query().findOne({ email });
    if (existing) {
        const error = new Error('Email is already in use.');
        error.statusCode = 409;
        throw error;
    }

    const roleName = role || 'member';
    if (!VALID_ROLES.includes(roleName)) {
        const error = new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    const roleRecord = await Role.query().findOne({ name: roleName });
    const isAdmin    = roleName === 'admin';
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.query().insertAndFetch({
        email,
        password:    hashedPassword,
        is_verified: isAdmin,
        role_id:     roleRecord.id,
    });

    await user.$relatedQuery('userInfo').insert({
        first_name,
        middle_name: middle_name || null,
        last_name,
    });

    if (!isAdmin) {
        const { token, expiresAt } = generateVerificationToken();
        await EmailVerification.query().insert({
            user_id:    user.id,
            token,
            expires_at: expiresAt,
        });

        try {
            await sendVerificationEmail(email, first_name, token);
        } catch (mailError) {
            console.error('[mailService] Failed to send verification email:', mailError.message);
        }
    }

    return { user, skipVerification: isAdmin };
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
    const verification = await EmailVerification.query().findOne({ token });

    if (!verification) {
        const error = new Error('Invalid or expired verification token.');
        error.statusCode = 400;
        throw error;
    }

    if (new Date() > new Date(verification.expires_at)) {
        const error = new Error('Verification token has expired. Please request a new one.');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.query().findById(verification.user_id);

    if (user.is_verified) {
        const error = new Error('Account is already verified.');
        error.statusCode = 400;
        throw error;
    }

    await User.query().patchAndFetchById(verification.user_id, {
        is_verified: true,
    });

    await EmailVerification.query().deleteById(verification.id);
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

    await EmailVerification.query().where({ user_id: user.id }).delete();
    await EmailVerification.query().insert({
        user_id:    user.id,
        token,
        expires_at: expiresAt,
    });

    const username = user.userInfo?.first_name || email.split('@')[0];
    await sendVerificationEmail(email, username, token);
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationEmail
};