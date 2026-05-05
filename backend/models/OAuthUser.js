const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OAuthUser = sequelize.define('OAuthUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provider: {
        type: DataTypes.ENUM('google', 'facebook'),
        allowNull: false
    },
    providerId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'provider_id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: 'oauth_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['provider', 'provider_id'],
            name: 'unique_provider_user'
        },
        {
            fields: ['provider']
        },
        {
            fields: ['user_id']
        }
    ]
});

module.exports = OAuthUser;
