const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async ({ username, email, password }) => {
    
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
        const error = new Error("Email already in use");
        error.statusCode = 409;
        throw error;
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await User.query().insert({
        username,
        email,
        password: hashedPassword
    });

    return { userId: newUser.id };
};

const loginUser = async ({ email, password }) => {
    
    const user = await User.query().findOne({ email });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

   
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
};

module.exports = {
    registerUser,
    loginUser
};