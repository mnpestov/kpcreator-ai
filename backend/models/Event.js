const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contractorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Contractors',
      key: 'id'
    }
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: true // changed to true for backward compatibility as startEvent becomes primary
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  startEvent: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  endEvent: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  startTimeStartEvent: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTimeStartEvent: {
    type: DataTypes.TIME,
    allowNull: true
  },
  startTimeEndEvent: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTimeEndEvent: {
    type: DataTypes.TIME,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Draft'
  },
  countOfPerson: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Event;
