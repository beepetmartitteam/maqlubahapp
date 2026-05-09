const sequelize = require('../config/database');
const User = require('./User');
const Customer = require('./Customer');
const CustomerNote = require('./CustomerNote');
const OAuthUser = require('./OAuthUser');
const jualanSabun = require('./jualanSabun');
const Ahli = require('./ahli');

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
    syncDatabase
};
