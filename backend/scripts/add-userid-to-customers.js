const { sequelize } = require('../config/database');
require('dotenv').config();

async function addUserIdToCustomers() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Check if user_id column exists in customers table
        const [results] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.columns 
            WHERE table_name = 'customers' 
            AND column_name = 'user_id' 
            AND table_schema = DATABASE()
        `);

        const columnExists = results[0].count > 0;

        if (!columnExists) {
            console.log('Adding user_id column to customers table...');
            
            // Add user_id column
            await sequelize.query(`
                ALTER TABLE customers 
                ADD COLUMN user_id INT NOT NULL DEFAULT 1 AFTER id
            `);

            // Add foreign key constraint
            await sequelize.query(`
                ALTER TABLE customers 
                ADD CONSTRAINT fk_customers_user_id 
                FOREIGN KEY (user_id) REFERENCES users(id) 
                ON DELETE CASCADE ON UPDATE CASCADE
            `);

            // Add index for better performance
            await sequelize.query(`
                CREATE INDEX idx_customers_user_id ON customers(user_id)
            `);

            console.log('user_id column added successfully.');
        } else {
            console.log('user_id column already exists in customers table.');
        }

        // Check if customer_notes table exists and has customer_id foreign key
        try {
            const [notesResults] = await sequelize.query(`
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_name = 'customer_notes' 
                AND column_name = 'customer_id' 
                AND table_schema = DATABASE()
            `);

            const customerNotesColumnExists = notesResults[0].count > 0;

            if (customerNotesColumnExists) {
                console.log('customer_notes table and customer_id column already exist.');
            }
        } catch (error) {
            console.log('customer_notes table does not exist yet.');
        }

        // Check if customer_notes table has user_id column
        try {
            const [notesUserIdResults] = await sequelize.query(`
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_name = 'customer_notes' 
                AND column_name = 'user_id' 
                AND table_schema = DATABASE()
            `);

            const notesUserIdColumnExists = notesUserIdResults[0].count > 0;

            if (!notesUserIdColumnExists) {
                console.log('Adding user_id column to customer_notes table...');
                
                // Add user_id column
                await sequelize.query(`
                    ALTER TABLE customer_notes 
                    ADD COLUMN user_id INT NOT NULL DEFAULT 1 AFTER id
                `);

                // Add foreign key constraint
                await sequelize.query(`
                    ALTER TABLE customer_notes 
                    ADD CONSTRAINT fk_customer_notes_user_id 
                    FOREIGN KEY (user_id) REFERENCES users(id) 
                    ON DELETE CASCADE ON UPDATE CASCADE
                `);

                // Add index for better performance
                await sequelize.query(`
                    CREATE INDEX idx_customer_notes_user_id ON customer_notes(user_id)
                `);

                console.log('user_id column added to customer_notes table successfully.');
            } else {
                console.log('user_id column already exists in customer_notes table.');
            }
        } catch (error) {
            console.log('Failed to add user_id to customer_notes:', error.message);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

addUserIdToCustomers();
