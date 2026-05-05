const sequelize = require('../config/database');
require('dotenv').config();

async function fixCustomerNotesUserId() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Step 1: Check if user_id column exists in customer_notes
        const [results] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.columns 
            WHERE table_name = 'customer_notes' 
            AND column_name = 'user_id' 
            AND table_schema = DATABASE()
        `);

        const columnExists = results[0].count > 0;

        if (!columnExists) {
            console.log('Adding user_id column to customer_notes table...');
            
            // Add user_id column as nullable first
            await sequelize.query(`
                ALTER TABLE customer_notes 
                ADD COLUMN user_id INT NULL AFTER id
            `);

            console.log('user_id column added successfully.');
        } else {
            console.log('user_id column already exists in customer_notes table.');
        }

        // Step 2: Update existing records to have a valid user_id (assuming user with id=1 exists)
        console.log('Updating existing customer_notes records...');
        
        const updateResult = await sequelize.query(`
            UPDATE customer_notes 
            SET user_id = 1 
            WHERE user_id IS NULL
        `);

        console.log(`Updated ${updateResult[0].affectedRows} records.`);

        // Step 3: Check if foreign key constraint exists
        const [constraintResults] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.table_constraints 
            WHERE table_name = 'customer_notes' 
            AND constraint_name = 'customer_notes_user_id_foreign_idx'
            AND table_schema = DATABASE()
        `);

        const constraintExists = constraintResults[0].count > 0;

        if (!constraintExists) {
            console.log('Adding foreign key constraint...');
            
            // Add foreign key constraint
            await sequelize.query(`
                ALTER TABLE customer_notes 
                ADD CONSTRAINT customer_notes_user_id_foreign_idx 
                FOREIGN KEY (user_id) REFERENCES users(id) 
                ON DELETE CASCADE ON UPDATE CASCADE
            `);

            console.log('Foreign key constraint added successfully.');
        } else {
            console.log('Foreign key constraint already exists.');
        }

        // Step 4: Add index for better performance if it doesn't exist
        const [indexResults] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.statistics 
            WHERE table_name = 'customer_notes' 
            AND index_name = 'idx_customer_notes_user_id'
            AND table_schema = DATABASE()
        `);

        const indexExists = indexResults[0].count > 0;

        if (!indexExists) {
            console.log('Adding index for user_id...');
            
            await sequelize.query(`
                CREATE INDEX idx_customer_notes_user_id ON customer_notes(user_id)
            `);

            console.log('Index added successfully.');
        } else {
            console.log('Index already exists.');
        }

        console.log('Customer notes user_id fix completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
}

fixCustomerNotesUserId();
