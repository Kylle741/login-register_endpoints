/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Create roles table
    await knex.schema.createTable('roles', (table) => {
        table.increments('id').primary();
        table.string('name', 50).notNullable().unique();
        table.timestamps(true, true);
    });

    // 2. Insert default roles
    await knex('roles').insert([
        { name: 'admin' },
        { name: 'staff' },
        { name: 'member' },
    ]);

    // 3. Add role_id to users table
    await knex.schema.alterTable('users', (table) => {
        table.integer('role_id').unsigned().nullable();
        table.foreign('role_id').references('roles.id').onDelete('SET NULL');
    });

    // 4. Set all existing users to 'member' by default
    const memberRole = await knex('roles').where({ name: 'member' }).first();
    await knex('users').update({ role_id: memberRole.id });
};

exports.down = async function (knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropForeign('role_id');
        table.dropColumn('role_id');
    });

    await knex.schema.dropTable('roles');
};