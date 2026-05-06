const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'birth_date'
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    age: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    kerjaya: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    kerjasama: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    kehidupanKeluarga: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'kehidupan_keluarga'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avatarUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'avatar_url'
    }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Customer;
