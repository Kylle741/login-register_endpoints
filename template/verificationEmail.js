const verificationEmailTemplate = (username, verificationUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 30px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #185FA5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { margin-top: 20px; font-size: 12px; color: #999999; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Hi ${username}! 👋</h2>
            <p>Thanks for registering. Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p style="margin-top: 16px;">Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #185FA5;">${verificationUrl}</p>
            <p>This link expires in <strong>24 hours</strong>.</p>
            <div class="footer">If you did not create an account, you can ignore this email.</div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { verificationEmailTemplate };