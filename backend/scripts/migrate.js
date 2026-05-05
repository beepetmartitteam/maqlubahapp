const { sequelize } = require('../config/database');
require('dotenv').config();

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        await sequelize.sync({ force: false, alter: true });
        console.log('Database migration completed successfully.');
        
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
