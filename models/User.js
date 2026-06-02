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
                id:                             { type: 'integer' },
                email:                          { type: 'string', format: 'email', maxLength: 150 },
                password:                       { type: 'string', minLength: 6 },
                is_verified:                    { type: 'boolean' },
                verification_token:             { type: ['string', 'null'] },
                verification_token_expires_at:  { type: ['string', 'null'] },
                created_at:                     { type: 'string' },
                updated_at:                     { type: 'string' }
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
                    to: 'user_info.user_id'
                }
            }
        };
    }

    $formatJson(json) {
        json = super.$formatJson(json);
        delete json.password;
        delete json.verification_token;
        delete json.verification_token_expires_at;
        return json;
    }
}

module.exports = User;