const EmailVerification = require('../models/EmailVerification');
const User              = require('../models/User.js');
const verifyEmailPage   = require('../template/verifyEmailPage');

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send(verifyEmailPage('error', 'Verification token is required.'));
        }

        const verification = await EmailVerification.query().findOne({ token });

        if (!verification) {
            return res.status(400).send(verifyEmailPage('error', 'Invalid or expired verification token.'));
        }

        if (new Date() > new Date(verification.expires_at)) {
            return res.status(400).send(verifyEmailPage('error', 'Verification token has expired. Please request a new one.'));
        }

        const user = await User.query().findById(verification.user_id);

        if (user.is_verified) {
            return res.status(400).send(verifyEmailPage('error', 'This account is already verified. You can log in.'));
        }

        await User.query().patchAndFetchById(verification.user_id, {
            is_verified: true,
        });

        await EmailVerification.query().deleteById(verification.id);

        return res.status(200).send(verifyEmailPage('success', 'Your email has been verified! You can now log in.'));

    } 
    catch (error) {
        console.error('Verify error:', error);
        return res.status(500).send(verifyEmailPage('error', 'Something went wrong. Please try again later.'));
    }
};

module.exports = { verifyEmail };