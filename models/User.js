const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'password'],
            properties: {
                id:         { type: 'integer' },
                username:   { type: 'string', minLength: 1, maxLength: 100 },
                email:      { type: 'string', format: 'email', maxLength: 150 },
                password:   { type: 'string', minLength: 6 },
                created_at: { type: 'string' }
            }
        };
    }


    $formatJson(json) {
        json = super.$formatJson(json);
        delete json.password;
        return json;
    }
}

module.exports = User;