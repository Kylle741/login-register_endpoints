const path = require('path');
const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                id:          { type: 'integer' },
                email:       { type: 'string', format: 'email', maxLength: 150 },
                password:    { type: 'string', minLength: 6 },
                is_verified: { type: 'boolean' },
                role_id:     { type: ['integer', 'null'] },
                created_at:  { type: 'string' },
                updated_at:  { type: 'string' }
            }
        };
    }

    static get relationMappings() {
        return {
            userInfo: {
                relation: Model.HasOneRelation,
                modelClass: path.join(__dirname, 'UserInfo'),
                join: {
                    from: 'users.id',
                    to:   'user_info.user_id'
                }
            },
            emailVerification: {
                relation: Model.HasOneRelation,
                modelClass: path.join(__dirname, 'EmailVerification'),
                join: {
                    from: 'users.id',
                    to:   'email_verifications.user_id'
                }
            },
            role: {
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname, 'Role'),
                join: {
                    from: 'users.role_id',
                    to:   'roles.id'
                }
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