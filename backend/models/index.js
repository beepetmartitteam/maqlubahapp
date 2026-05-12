const sequelize = require('../config/database');
const User = require('./User');
const Customer = require('./Customer');
const CustomerNote = require('./CustomerNote');
const OAuthUser = require('./OAuthUser');
const jualanSabun = require('./jualanSabun');
const Ahli = require('./ahli');

// Company Management models
const Company = require('./Company');
const Staff = require('./Staff');
const Plan = require('./Plan');
const Report = require('./Report');
const Task = require('./Task');

// Define associations
User.hasMany(Customer, {
    foreignKey: 'userId',
    as: 'customers'
});

Customer.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(CustomerNote, {
    foreignKey: 'userId',
    as: 'notes'
});

Customer.hasMany(CustomerNote, {
    foreignKey: 'customerId',
    as: 'customerNotes'
});

CustomerNote.belongsTo(Customer, {
    foreignKey: 'customerId',
    as: 'customer'
});

CustomerNote.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// OAuthUser associations
User.hasMany(OAuthUser, {
    foreignKey: 'userId',
    as: 'oauthAccounts'
});

OAuthUser.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Register Ahli model with sequelize
const AhliModel = Ahli(sequelize);

// Jualan Sabun models
const jualanSabunModels = jualanSabun(sequelize);
const { JualanSabunRecord, JualanSabunDetail, Folder } = jualanSabunModels;

// Company Management models
const CompanyModel = Company(sequelize);
const StaffModel = Staff(sequelize);
const PlanModel = Plan(sequelize);
const ReportModel = Report(sequelize);
// const TaskModel = Task(sequelize); // Temporarily disabled to isolate issue

// Set up Company Management associations
const models = {
  Company: CompanyModel,
  Staff: StaffModel,
  Plan: PlanModel,
  Report: ReportModel
  // Task: TaskModel // Temporarily disabled
};

CompanyModel.associate(models);
StaffModel.associate(models);
PlanModel.associate(models);
ReportModel.associate(models);
// TaskModel.associate(models); // Temporarily disabled



// Sync database
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    User,
    Customer,
    CustomerNote,
    OAuthUser,
    Ahli: AhliModel,
    JualanSabunRecord,
    JualanSabunDetail,
    Folder,
    // Company Management models
    Company: CompanyModel,
    Staff: StaffModel,
    Plan: PlanModel,
    Report: ReportModel,
    // Task: TaskModel, // Temporarily disabled
    syncDatabase
};
