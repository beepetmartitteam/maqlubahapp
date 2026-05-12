const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
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
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'staff_id',
      references: {
        model: 'staff',
        key: 'id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('financial', 'performance', 'project', 'operational', 'compliance'),
      allowNull: false,
      defaultValue: 'performance'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.JSON,
      allowNull: true
    },
    period: {
      type: DataTypes.STRING,
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
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'draft'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    metrics: {
      type: DataTypes.JSON,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'reviewed_by',
      references: {
        model: 'staff',
        key: 'id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at'
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Report.associate = function(models) {
    // Association with Company
    Report.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });

    // Association with Staff (creator)
    Report.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'creator'
    });

    // Association with Staff (reviewer)
    Report.belongsTo(models.Staff, {
      foreignKey: 'reviewed_by',
      as: 'reviewer'
    });
  };

  return Report;
};
