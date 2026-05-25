const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transaction } = require('objection');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

const registerUser = async ({ email, password, userInfo }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = userInfo.username.trim();

    const existingUser = await User.query().findOne({ email: cleanEmail });

    if (existingUser) {
        const error = new Error('Email already exists');
        error.statusCode = 409;
        throw error;
    }

    // Save both tables together so registration is complete or fails completely.
    const user = await transaction(User.knex(), async (trx) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.query(trx).insertAndFetch({
            email: cleanEmail,
            password: hashedPassword
        });

        await UserInfo.query(trx).insert({
            user_id: newUser.id,
            username: cleanUsername
        });

        return await User.query(trx)
            .findById(newUser.id)
            .withGraphFetched('userInfo');
    });

    return user;
};

const loginUser = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    // Get the user and the related profile data.
    const user = await User.query()
        .findOne({ email: cleanEmail })
        .withGraphFetched('userInfo');

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    if (!process.env.JWT_SECRET) {
        const error = new Error('JWT_SECRET is missing in .env');
        error.statusCode = 500;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: user
    };
};

module.exports = {
    registerUser,
    loginUser
};
