const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Must be a valid email address'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password must be between 6 and 255 characters'
            }
        }
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'last_name'
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    avatarUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'avatar_url'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'email_verified'
    },
    oauthProvider: {
        type: DataTypes.ENUM('local', 'google', 'facebook'),
        defaultValue: 'local',
        field: 'oauth_provider'
    },
    oauthId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'oauth_id'
    },
    allowed_menu:{
        type: DataTypes.STRING(255),
        allowNull:true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false
    }
}, {
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password && user.oauthProvider === 'local') {
                const saltRounds = 10;
                user.password = await bcrypt.hash(user.password, saltRounds);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password && user.changed('password')) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(user.password, saltRounds);
            }
        }
    }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;
