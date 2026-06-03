const cron = require('node-cron');
const User = require('../models/User');
const { sendVerificationEmail } = require('./mailService');
const crypto = require('crypto');

const generateVerificationToken = () => ({
    token:     crypto.randomBytes(32).toString('hex'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
});

const resendExpiredVerifications = async () => {
    console.log('[cron] Checking for unverified users with expired tokens...');

    try {
        const expiredUsers = await User.query()
            .where('is_verified', false)
            .whereNotNull('verification_token_expires_at')
            .where('verification_token_expires_at', '<', new Date().toISOString())
            .withGraphFetched('userInfo');

        if (expiredUsers.length === 0) {
            console.log('[cron] No expired unverified users found.');
            return;
        }

        console.log(`[cron] Found ${expiredUsers.length} unverified user(s). Resending...`);

        for (const user of expiredUsers) {
            try {
                const { token, expiresAt } = generateVerificationToken();

                await User.query().patchAndFetchById(user.id, {
                    verification_token:            token,
                    verification_token_expires_at: expiresAt
                });

                const username = user.userInfo?.username || user.email.split('@')[0];
                await sendVerificationEmail(user.email, username, token);

                console.log(`[cron] Resent verification to: ${user.email}`);
            } catch (err) {
                console.error(`[cron] Failed to resend for ${user.email}:`, err.message);
            }
        }

        console.log('[cron] Auto-resend complete.');
    } catch (err) {
        console.error('[cron] Error during auto-resend job:', err.message);
    }
};

const startVerificationCron = () => {
    cron.schedule('0 * * * *', resendExpiredVerifications);
    console.log('[cron] Auto-resend verification job scheduled (runs every hour).');
};

module.exports = { startVerificationCron };