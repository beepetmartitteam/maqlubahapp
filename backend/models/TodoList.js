const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TodoList = sequelize.define('TodoList', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    assignee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'company_id',
      references: {
        model: 'companies',
        key: 'id'
      }
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
    tableName: 'todo_lists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TodoList.associate = function(models) {
    // Association with Company
    TodoList.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company',
      onDelete: 'SET NULL'
    });

    // Association with User
    TodoList.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL'
    });

    // Company has many TodoLists
    models.Company.hasMany(TodoList, {
      foreignKey: 'company_id',
      as: 'todoLists',
      onDelete: 'CASCADE'
    });

    // User has many TodoLists
    models.User.hasMany(TodoList, {
      foreignKey: 'user_id',
      as: 'todoLists',
      onDelete: 'CASCADE'
    });
  };

  return TodoList;
};
