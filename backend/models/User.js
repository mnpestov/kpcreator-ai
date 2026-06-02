const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  job: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tel: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true // путь до изображения или ссылка
  },
  role: {
    type: DataTypes.ENUM('manager', 'admin'),
    defaultValue: 'manager'
  }
});

module.exports = User;
