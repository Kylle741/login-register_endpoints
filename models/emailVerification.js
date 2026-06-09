const { Model } = require('objection');

class EmailVerification extends Model {
    static get tableName() {
        return 'email_verifications';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'token', 'expires_at'],
            properties: {
                id:         { type: 'integer' },
                user_id:    { type: 'integer' },
                token:      { type: 'string' },
                expires_at: { type: 'string' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' }
            }
        };
    }

    static get relationMappings() {
        const path = require('path');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname, 'User'),
                join: {
                    from: 'email_verifications.user_id',
                    to:   'users.id'
                }
            }
        };
    }
}

module.exports = EmailVerification;