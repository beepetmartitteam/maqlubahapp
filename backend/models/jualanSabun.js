const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JualanSabunRecord = sequelize.define('JualanSabunRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Month (1-12)'
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Week (1-4)'
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Year (e.g., 2026)'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'total_amount',
      comment: 'Total sales amount'
    },
    totalMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_members',
      comment: 'Total number of members'
    },
    paidMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'paid_members',
      comment: 'Number of paid members'
    },
    recordDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'record_date',
      comment: 'Record date'
    },
    status: {
      type: DataTypes.ENUM('active', 'completed'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Record status'
    }
  }, {
    tableName: 'jualan_sabun_records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['month', 'week', 'year'],
        name: 'idx_month_week_year'
      },
      {
        fields: ['status'],
        name: 'idx_status'
      },
      {
        fields: ['record_date'],
        name: 'idx_record_date'
      }
    ]
  });

  const JualanSabunDetail = sequelize.define('JualanSabunDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'record_id',
      comment: 'Reference to main record'
    },
    folderId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'folder_id',
      comment: 'Folder reference'
    },
    folderLabel: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'folder_label',
      comment: 'Folder name at time of record'
    },
    ahliId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ahli_id',
      comment: 'Reference to ahli table',
      references: {
        model: 'ahlis',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'amount',
      comment: 'Payment amount'
    }
  }, {
    tableName: 'jualan_sabun_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['record_id'],
        name: 'idx_record_id'
      },
      {
        fields: ['folder_id'],
        name: 'idx_folder_id'
      },
      {
        fields: ['ahli_id'],
        name: 'idx_ahli_id'
      }
    ]
  });

  const Folder = sequelize.define('Folder', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      comment: 'Folder ID (S13, MKN, etc.)'
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Folder display name with emoji'
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      comment: 'Folder color code'
    }
  }, {
    tableName: 'folders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Define associations
  JualanSabunRecord.hasMany(JualanSabunDetail, {
    foreignKey: 'recordId',
    as: 'details',
    onDelete: 'CASCADE'
  });

  JualanSabunDetail.belongsTo(JualanSabunRecord, {
    foreignKey: 'recordId',
    as: 'record'
  });

  
  Folder.hasMany(JualanSabunRecord, {
    foreignKey: 'folderId',
    sourceKey: 'id',
    as: 'records'
  });

  JualanSabunRecord.belongsTo(Folder, {
    foreignKey: 'folderId',
    targetKey: 'id',
    as: 'folder'
  });

  return {
    JualanSabunRecord,
    JualanSabunDetail,
    Folder
  };
};
