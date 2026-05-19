const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    // BAHAGIAN A (PROFILE MEMBER)
    husbandName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'husband_name'
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    homeAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'home_address'
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wives: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    marriedChildren: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'married_children'
    },
    unmarriedChildren: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'unmarried_children'
    },
    currentJob: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'current_job'
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'company_name'
    },
    
    // BAHAGIAN B (MAKLUMAT TTG KEHIDUPAN)
    struggleUnderstanding: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'struggle_understanding'
    },
    familySituation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'family_situation'
    },
    welfareStatus: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'welfare_status'
    },
    fivePActivities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: 'five_p_activities'
    },
    complianceLevel: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'compliance_level'
    },
    
    // BAHAGIAN C (UTK PENILAIAN)
    struggleAssessment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'struggle_assessment',
      validate: {
        min: 1,
        max: 5
      }
    },
    familyManagementAssessment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'family_management_assessment',
      validate: {
        min: 1,
        max: 5
      }
    },
    welfareAssessment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'welfare_assessment',
      validate: {
        min: 1,
        max: 5
      }
    },
    fivePAssessment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'five_p_assessment',
      validate: {
        min: 1,
        max: 5
      }
    },
    complianceAssessment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'compliance_assessment',
      validate: {
        min: 1,
        max: 5
      }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Status and metadata
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      allowNull: false,
      defaultValue: 'active'
    },
    joinDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'join_date'
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'last_updated'
    }
  }, {
    tableName: 'members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Member.associate = (models) => {
    if (models.User) {
      Member.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };

  return Member;
};
