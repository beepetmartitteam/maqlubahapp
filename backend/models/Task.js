const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'plan_id',
      references: {
        model: 'plans',
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
      type: DataTypes.ENUM('todo', 'in-progress', 'completed', 'cancelled', 'blocked'),
      allowNull: false,
      defaultValue: 'todo'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
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
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: 'estimated_hours'
    },
    actualHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.00,
      field: 'actual_hours'
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
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    taskDependencies: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'dependencies'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at'
    }
  }, {
    tableName: 'tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Task.associate = function(models) {
    // Association with Plan
    Task.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      as: 'plan'
    });

    // Association with Staff (assigned to)
    Task.belongsTo(models.Staff, {
      foreignKey: 'assigned_to',
      as: 'assignedStaff'
    });

    // Self-referencing for dependencies
    Task.belongsToMany(models.Task, {
      through: 'task_dependencies',
      as: 'dependencies',
      foreignKey: 'task_id',
      otherKey: 'dependency_id'
    });
  };

  return Task;
};
