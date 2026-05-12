const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plan = sequelize.define('Plan', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('planning', 'in-progress', 'completed', 'cancelled', 'on-hold'),
      allowNull: false,
      defaultValue: 'planning'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date'
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    actualCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: 'actual_cost'
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'assigned_to',
      references: {
        model: 'staff',
        key: 'id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Plan.associate = function(models) {
    // Association with Company
    Plan.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });

    // Association with Staff (assigned to)
    Plan.belongsTo(models.Staff, {
      foreignKey: 'assigned_to',
      as: 'assignedStaff'
    });

    // Association with Tasks (if plans can have sub-tasks)
    // Plan.hasMany(models.Task, {
    //   foreignKey: 'plan_id',
    //   as: 'tasks',
    //   onDelete: 'CASCADE'
    // }); // Temporarily disabled
  };

  return Plan;
};
