const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ahli = sequelize.define('Ahli', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    folderId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'folders',
        key: 'id'
      }
    },
    folderLabel: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ahlis',
    timestamps: true,
    indexes: [
      {
        fields: ['folderId']
      },
      {
        fields: ['name']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  // Setup associations after all models are defined
  Ahli.associate = function(models) {
    Ahli.hasMany(models.JualanSabunDetail, {
      foreignKey: 'ahliId',
      sourceKey: 'id',
      as: 'jualanDetails'
    });
  };

  return Ahli;
};
