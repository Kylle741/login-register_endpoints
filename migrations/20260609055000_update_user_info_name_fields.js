/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasFirstName = await knex.schema.hasColumn('user_info', 'first_name');

    if (!hasFirstName) {
        await knex.schema.alterTable('user_info', (table) => {
            table.string('first_name', 100).nullable();
            table.string('middle_name', 100).nullable();
            table.string('last_name', 100).nullable();
        });
    }

    const hasUsername = await knex.schema.hasColumn('user_info', 'username');

    if (hasUsername) {
        await knex('user_info').update({
            first_name: knex.ref('username')
        });

        await knex.schema.alterTable('user_info', (table) => {
            table.dropColumn('username');
        });
    }
};

exports.down = async function (knex) {
    const hasUsername = await knex.schema.hasColumn('user_info', 'username');
    const hasFirstName = await knex.schema.hasColumn('user_info', 'first_name');

    if (!hasUsername) {
        await knex.schema.alterTable('user_info', (table) => {
            table.string('username', 100).nullable();
        });
    }

    if (hasFirstName) {
        await knex('user_info').update({
            username: knex.ref('first_name')
        });

        await knex.schema.alterTable('user_info', (table) => {
            table.dropColumn('first_name');
            table.dropColumn('middle_name');
            table.dropColumn('last_name');
        });
    }
};