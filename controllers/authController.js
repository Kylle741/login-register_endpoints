const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ message: "Username is required" });
    if (!email)    return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    try {
        const result = await registerUser({ username, email, password });
        res.status(201).json({
            message: "User registered successfully",
            ...result
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email)    return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    try {
        const result = await loginUser({ email, password });
        res.json({
            message: "Login successful",
            ...result
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

module.exports = { 
    register, 
    login 
};