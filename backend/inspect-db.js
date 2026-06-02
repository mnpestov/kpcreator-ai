const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false
    }
);

async function inspectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');
        
        // Find all unique constraints
        const [results] = await sequelize.query(`
            SELECT table_name, constraint_name 
            FROM information_schema.table_constraints 
            WHERE constraint_type = 'UNIQUE' 
              AND constraint_name NOT LIKE '%_pkey'
        `);
        
        console.log('Unique constraints in DB:');
        console.table(results);

    } catch (e) {
        console.error('Error connecting:', e);
    } finally {
        await sequelize.close();
    }
}

inspectDB();
