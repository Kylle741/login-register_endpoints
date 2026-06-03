const nodemailer = require('nodemailer');
const { verificationEmailTemplate } = require('../template/verificationEmail');

const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendVerificationEmail = async (toEmail, username, token) => {
    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    await transporter.sendMail({
        from:    `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to:      toEmail,
        subject: 'Verify your email address',
        html:    verificationEmailTemplate(username, verificationUrl)
    });
};

module.exports = { sendVerificationEmail };