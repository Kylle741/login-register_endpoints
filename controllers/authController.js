const {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationEmail
} = require('../services/authService');

const register = async (req, res) => {
    try {
        const { first_name, middle_name, last_name, email, password, role } = req.body;

        if (!first_name || !last_name || !email || !password)
            return res.status(400).json({ message: 'First name, last name, email and password are required.' });

        const user = await registerUser({ first_name, middle_name, last_name, email, password, role });

        if (user.skipVerification) {
            return res.status(201).json({
                message: 'Registration successful. You can now log in.',
                user: user.user
            });
        }

        return res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            user: user.user
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required.' });

        const token = await loginUser(email, password);
        return res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const verifyEmailHandler = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token)
            return res.status(400).json({ message: 'Verification token is required.' });

        await verifyEmail(token);
        return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: 'Email is required.' });

        await resendVerificationEmail(email);
        return res.status(200).json({
            message: 'If this email exists and is unverified, a new verification link has been sent.'
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = { register, login, verifyEmailHandler, resendVerification };