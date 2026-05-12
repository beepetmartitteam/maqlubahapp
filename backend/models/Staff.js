const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Staff = sequelize.define('Staff', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'company_id',
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
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
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'hire_date'
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'terminated'),
      allowNull: false,
      defaultValue: 'active'
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'emergency_contact'
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'staff',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Staff.associate = function(models) {
    // Association with Company
    Staff.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });

    // Association with Reports (if staff can create reports)
    Staff.hasMany(models.Report, {
      foreignKey: 'staff_id',
      as: 'reports',
      onDelete: 'CASCADE'
    });
  };

  return Staff;
};
