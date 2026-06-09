const cron              = require('node-cron');
const User              = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { sendVerificationEmail } = require('./mailService');
const crypto            = require('crypto');

const generateVerificationToken = () => ({
    token:     crypto.randomBytes(32).toString('hex'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
});

const resendExpiredVerifications = async () => {
    console.log('[cron] Checking for unverified users with expired tokens...');

    try {
        const expiredVerifications = await EmailVerification.query()
            .where('expires_at', '<', new Date().toISOString())
            .withGraphFetched('user.userInfo');

        if (expiredVerifications.length === 0) {
            console.log('[cron] No expired unverified users found.');
            return;
        }

        console.log(`[cron] Found ${expiredVerifications.length} unverified user(s). Resending...`);

        for (const verification of expiredVerifications) {
            try {
                const user = verification.user;

                // Skip if already verified
                if (user.is_verified) {
                    await EmailVerification.query().deleteById(verification.id);
                    continue;
                }

                const { token, expiresAt } = generateVerificationToken();

                // Replace old token with new one
                await EmailVerification.query().patchAndFetchById(verification.id, {
                    token,
                    expires_at: expiresAt,
                });

                const username = user.userInfo?.username || user.email.split('@')[0];
                await sendVerificationEmail(user.email, username, token);

                console.log(`[cron] Resent verification to: ${user.email}`);
            } catch (err) {
                console.error(`[cron] Failed to resend for ${verification.user?.email}:`, err.message);
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