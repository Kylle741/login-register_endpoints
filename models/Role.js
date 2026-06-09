const { Model } = require('objection');

class Role extends Model {
    static get tableName() {
        return 'roles';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id:         { type: 'integer' },
                name:       { type: 'string', maxLength: 50 },
                created_at: { type: 'string' },
                updated_at: { type: 'string' }
            }
        };
    }
}

module.exports = Role;