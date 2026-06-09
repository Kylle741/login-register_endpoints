/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Create the new email_verifications table
    await knex.schema.createTable('email_verifications', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.string('token', 255).notNullable();
        table.timestamp('expires_at').notNullable();
        table.timestamps(true, true);
    });

    // 2. Copy existing token data from users to email_verifications
    const users = await knex('users')
        .whereNotNull('verification_token')
        .select('id', 'verification_token', 'verification_token_expires_at');

    if (users.length > 0) {
        await knex('email_verifications').insert(
            users.map(user => ({
                user_id:    user.id,
                token:      user.verification_token,
                expires_at: user.verification_token_expires_at,
            }))
        );
    }

    // 3. Drop the old columns from users table
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('verification_token');
        table.dropColumn('verification_token_expires_at');
    });
};

exports.down = async function (knex) {
    // Restore columns to users table
    await knex.schema.alterTable('users', (table) => {
        table.string('verification_token', 255).nullable();
        table.timestamp('verification_token_expires_at').nullable();
    });

    // Copy data back from email_verifications to users
    const verifications = await knex('email_verifications')
        .select('user_id', 'token', 'expires_at');

    for (const v of verifications) {
        await knex('users').where('id', v.user_id).update({
            verification_token:            v.token,
            verification_token_expires_at: v.expires_at,
        });
    }

    // Drop the new table
    await knex.schema.dropTable('email_verifications');
};
