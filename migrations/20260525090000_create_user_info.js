/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasUserInfoTable = await knex.schema.hasTable('user_info');

    if (!hasUserInfoTable) {
        await knex.schema.createTable('user_info', (table) => {
            table.increments('id').primary();
            table
                .integer('user_id')
                .unsigned()
                .notNullable()
                .unique()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            table.string('username', 100).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
    }

    const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');

    if (!hasUpdatedAt) {
        await knex.schema.alterTable('users', (table) => {
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
    }

    const hasUsernameColumn = await knex.schema.hasColumn('users', 'username');

    if (hasUsernameColumn) {
        const users = await knex('users').select('id', 'username');
        const existingProfiles = await knex('user_info').select('user_id');
        const existingProfileIds = new Set(existingProfiles.map((profile) => profile.user_id));
        const profilesToInsert = users
            .filter((user) => user.username && !existingProfileIds.has(user.id))
            .map((user) => ({
                user_id: user.id,
                username: user.username
            }));

        if (profilesToInsert.length > 0) {
            await knex('user_info').insert(profilesToInsert);
        }

        await knex.schema.alterTable('users', (table) => {
            table.dropColumn('username');
        });
    }
};

exports.down = async function (knex) {
    const hasUsernameColumn = await knex.schema.hasColumn('users', 'username');

    if (!hasUsernameColumn) {
        await knex.schema.alterTable('users', (table) => {
            table.string('username', 100).nullable();
        });
    }

    const hasUserInfoTable = await knex.schema.hasTable('user_info');

    if (hasUserInfoTable) {
        const profiles = await knex('user_info').select('user_id', 'username');

        for (const profile of profiles) {
            await knex('users')
                .where({ id: profile.user_id })
                .update({ username: profile.username });
        }

        await knex.schema.dropTable('user_info');
    }

    const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');

    if (hasUpdatedAt) {
        await knex.schema.alterTable('users', (table) => {
            table.dropColumn('updated_at');
        });
    }
};
