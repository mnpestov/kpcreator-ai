const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const MenuItem = sequelize.define('menuItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING }, // 'eat', 'drink', 'organisation', etc.
    weight: { type: DataTypes.INTEGER, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = MenuItem;
