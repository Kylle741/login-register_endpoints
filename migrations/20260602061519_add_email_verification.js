/**
 * Migration: Add email verification fields to users table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasIsVerified = await knex.schema.hasColumn('users', 'is_verified');
    const hasToken = await knex.schema.hasColumn('users', 'verification_token');
    const hasExpiry = await knex.schema.hasColumn('users', 'verification_token_expires_at');

    await knex.schema.alterTable('users', (table) => {
        if (!hasIsVerified) {
            table.boolean('is_verified').notNullable().defaultTo(false);
        }
        if (!hasToken) {
            table.string('verification_token', 255).nullable();
        }
        if (!hasExpiry) {
            table.timestamp('verification_token_expires_at').nullable();
        }
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('is_verified');
        table.dropColumn('verification_token');
        table.dropColumn('verification_token_expires_at');
    });
};