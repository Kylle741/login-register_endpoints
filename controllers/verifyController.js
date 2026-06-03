const User = require('../models/User.js');

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const FRONTEND_URL = process.env.FRONTEND_URL;

        if (!token) {
            return res.redirect(`${FRONTEND_URL}/verify-email?status=missing`);
        }

        const user = await User.query().findOne({ verification_token: token });

        if (!user) {
            return res.redirect(`${FRONTEND_URL}/verify-email?status=invalid`);
        }

        // Token is expired
        const now = new Date();
        if (now > new Date(user.verification_token_expires_at)) {
            return res.redirect(`${FRONTEND_URL}/verify-email?status=expired`);
        }

        // Already verified
        if (user.is_verified) {
            return res.redirect(`${FRONTEND_URL}/verify-email?status=already_verified`);
        }

        // Mark as verified and clear token
        await User.query().patchAndFetchById(user.id, {
            is_verified:                   true,
            verification_token:            null,
            verification_token_expires_at: null,
        });

        // Redirect to login page with success flag
        return res.redirect(`${FRONTEND_URL}/login?verified=true`);

    } catch (error) {
        console.error('Verify error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=error`);
    }
};

module.exports = { verifyEmail };