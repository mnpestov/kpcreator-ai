const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
);

async function fixTel() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        await sequelize.query('UPDATE "Users" SET tel = \'7000000000\' || id WHERE tel IS NULL');
        console.log('Fixed null tels');
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

fixTel();
