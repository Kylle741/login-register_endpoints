const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !username.trim()) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!password || !password.trim()) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    try {
        const user = await registerUser({
            email,
            password,
            userInfo: {
                username
            }
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Register error:', error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!password || !password.trim()) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    try {
        const result = await loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

module.exports = {
    register,
    login
};
