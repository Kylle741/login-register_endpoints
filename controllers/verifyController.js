const User = require('../models/User.js');

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is missing.' });
        }

        // find the user with this token
        const user = await User.query().findOne({ verification_token: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link.' });
        }

        // check if the token is expired
        const now = new Date();
        if (now > new Date(user.verification_token_expires_at)) {
            return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
        }

        // check if already verified
        if (user.is_verified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        // mark as verified and clear the token
        await User.query().patchAndFetchById(user.id, {
            is_verified: true,
            verification_token: null,
            verification_token_expires_at: null,
        });

        return res.status(200).json({ message: 'Email verified successfully! You can now log in.' });

    } catch (error) {
        console.log('Verify error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { verifyEmail };