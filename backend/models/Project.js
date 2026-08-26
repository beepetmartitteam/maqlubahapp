const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('pejabat', 'tanah', 'premis', 'kilang', 'gudang', 'kedai', 'lain-lain'),
      allowNull: false,
      defaultValue: 'pejabat'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending', 'completed'),
      allowNull: false,
      defaultValue: 'active'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    negri: {
      type: DataTypes.STRING,
      allowNull: true
    },
    negara: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Malaysia'
    },
    syarikat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_urls: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    manager: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    orders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Project.associate = function(models) {
    // Association with User
    Project.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL'
    });

    // User has many Projects
    models.User.hasMany(Project, {
      foreignKey: 'user_id',
      as: 'projects',
      onDelete: 'CASCADE'
    });
  };

  return Project;
};
