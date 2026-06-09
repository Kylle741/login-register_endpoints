const path = require('path');
const { Model } = require('objection');

class UserInfo extends Model {
    static get tableName() {
        return 'user_info';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['first_name', 'last_name'],
            properties: {
                id:          { type: 'integer' },
                user_id:     { type: 'integer' },
                first_name:  { type: 'string', minLength: 1, maxLength: 100 },
                middle_name: { type: ['string', 'null'], maxLength: 100 },
                last_name:   { type: 'string', minLength: 1, maxLength: 100 },
                created_at:  { type: 'string' },
                updated_at:  { type: 'string' }
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname, 'User'),
                join: {
                    from: 'user_info.user_id',
                    to:   'users.id'
                }
            }
        };
    }
}

module.exports = UserInfo;