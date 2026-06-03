/**
 * Generates the HTML body for the verification email.
 * @param {string} verificationUrl - The full verification link.
 * @param {string} username - The user's name or email.
 * @returns {string} HTML string
 */
const verificationEmailTemplate = (verificationUrl, username = 'User') => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verify Your Email</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background-color: #4F46E5; padding: 32px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .body { padding: 32px; color: #333333; }
        .body p { font-size: 15px; line-height: 1.6; }
        .btn-wrap { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 15px; font-weight: bold; }
        .note { font-size: 13px; color: #888888; text-align: center; margin-top: 16px; }
        .footer { background-color: #f4f4f7; text-align: center; padding: 16px; font-size: 12px; color: #aaaaaa; }
        .divider { border: none; border-top: 1px solid #eeeeee; margin: 24px 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="body">
          <p>Hi <strong>${username}</strong>,</p>
          <p>Thank you for registering! Please verify your email address by clicking the button below. This link is valid for <strong>24 hours</strong>.</p>
          <div class="btn-wrap">
            <a href="${verificationUrl}" class="btn">Verify My Email</a>
          </div>
          <hr class="divider"/>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 13px; color: #4F46E5;">${verificationUrl}</p>
          <p class="note">If you did not create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your App. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = verificationEmailTemplate;