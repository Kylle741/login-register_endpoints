const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

require('./config/db');

const authRoutes = require('./routes/authRoutes');
const { startVerificationCron } = require('./services/verificationCron');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

startVerificationCron();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});