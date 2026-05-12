const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    employees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    growth: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: -100,
        max: 1000
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      allowNull: false,
      defaultValue: 'active'
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#1976d2',
      validate: {
        is: /^#[0-9A-Fa-f]{6}$/ // Hex color validation
      }
    },
    ceo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foundedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'founded_date'
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'registration_number'
    }
  }, {
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Company.associate = function(models) {
    // Association with Staff
    Company.hasMany(models.Staff, {
      foreignKey: 'company_id',
      as: 'staff',
      onDelete: 'CASCADE'
    });

    // Association with Plans
    Company.hasMany(models.Plan, {
      foreignKey: 'company_id',
      as: 'plans',
      onDelete: 'CASCADE'
    });

    // Association with Reports
    Company.hasMany(models.Report, {
      foreignKey: 'company_id',
      as: 'reports',
      onDelete: 'CASCADE'
    });
  };

  return Company;
};
