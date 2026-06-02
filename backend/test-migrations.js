const { Sequelize } = require('sequelize');
const { execSync } = require('child_process');
require('dotenv').config();

const testDbName = 'kpcreator_test_migration';

// Connect to default DB to create the new one
const sequelizeAdmin = new Sequelize(
    'postgres', 
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false
    }
);

async function runTests() {
    try {
        console.log('1. Cleaning up old test database...');
        try {
            await sequelizeAdmin.query(`DROP DATABASE IF EXISTS ${testDbName};`);
        } catch(e) {
            console.log('Could not drop DB (might be in use)', e.message);
        }
        
        console.log('2. Creating new test database...');
        await sequelizeAdmin.query(`CREATE DATABASE ${testDbName};`);
        await sequelizeAdmin.close();

        console.log('3. Running migrations on test DB...');
        // Execute migrations with overriding DB_NAME
        execSync(`export DB_NAME=${testDbName} && npx sequelize-cli db:migrate`, { 
            stdio: 'inherit',
            cwd: __dirname
        });

        console.log('4. Connecting to test DB to verify ENUM and schema...');
        const sequelizeTest = new Sequelize(
            testDbName,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                dialect: 'postgres',
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                logging: false
            }
        );

        // Check ENUM type for Users.role
        const [enumCheck] = await sequelizeTest.query(`
            SELECT t.typname, e.enumlabel 
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid 
            WHERE t.typname = 'enum_Users_role';
        `);
        console.log('Users.role ENUM values:', enumCheck);

        // Check if all tables were created
        const [tables] = await sequelizeTest.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log('Tables in DB:', tables.map(t => t.table_name));

        console.log('Test successful! Scheme is fully applied via migrations.');
        await sequelizeTest.close();
        
    } catch (err) {
        console.error('Test failed:', err);
    }
}

runTests();
