const sequelize = require('../db')

const { DataTypes } = require('sequelize')
const User = require('./User');
const Contractor = require('./Contractor');
const Event = require('./Event');

const Kp = sequelize.define('kp', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    kpNumber: { type: DataTypes.STRING, unique: true },
    kpDate: { type: DataTypes.DATEONLY },
    contractNumber: { type: DataTypes.STRING },
    contractDate: { type: DataTypes.DATEONLY },
    startEvent: { type: DataTypes.DATEONLY },
    endEvent: { type: DataTypes.DATEONLY },
    eventPlace: { type: DataTypes.STRING },
    countOfPerson: { type: DataTypes.STRING },
    isWithinMkad: { type: DataTypes.BOOLEAN, defaultValue: true },
    logisticsCost: { type: DataTypes.INTEGER },
    listTitle: { type: DataTypes.STRING },
    managerName: { type: DataTypes.STRING, allowNull: false },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', // имя таблицы в БД (убедись, что в базе она именно так названа)
            key: 'id'
        }
    }
})

// const Manager = sequelize.define('manager', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     name: { type: DataTypes.STRING, allowNull: false },
//     role: { type: DataTypes.STRING, allowNull: false },
//     email: { type: DataTypes.STRING, allowNull: false },
//     tel: { type: DataTypes.STRING, allowNull: false, unique: true },
// })

const List = sequelize.define('list', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    startEvent: { type: DataTypes.DATEONLY, allowNull: false },
    endEvent: { type: DataTypes.DATEONLY, allowNull: false },
    startTimeStartEvent: { type: DataTypes.TIME, allowNull: false },
    endTimeStartEvent: { type: DataTypes.TIME, allowNull: false },
    startTimeEndEvent: { type: DataTypes.TIME, allowNull: false },
    endTimeEndEvent: { type: DataTypes.TIME, allowNull: false },
    eventPlace: { type: DataTypes.STRING, allowNull: false },
    countOfPerson: { type: DataTypes.STRING, allowNull: false },
    listTitle: { type: DataTypes.STRING }
})

const Row = sequelize.define('row', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product: { type: DataTypes.STRING, allowNull: false },
    composition: { type: DataTypes.STRING },
    productWeight: { type: DataTypes.INTEGER, allowNull: true },
    countOfProduct: { type: DataTypes.INTEGER, allowNull: false },
    priceOfProduct: { type: DataTypes.INTEGER, allowNull: false },
    typeOfProduct: { type: DataTypes.STRING },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
})

// const Product = sequelize.define('product', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     name: { type: DataTypes.STRING, allowNull: false },                 // Название
//     composition: { type: DataTypes.TEXT },                               // Состав
//     productWeight: { type: DataTypes.STRING },                           // Масса/объём (строкой, если у вас нет единого формата)
//     typeOfProduct: { type: DataTypes.STRING },                           // Категория/тип (Еда/Напитки/Организация) — строкой
//     priceOfProduct: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
//     description: { type: DataTypes.TEXT },
//     photo: { type: DataTypes.STRING },                                   // URL/путь к фото
// });

// Kp.hasOne(Manager)
// Manager.belongsTo(Kp)

Kp.hasMany(List)
List.belongsTo(Kp)

List.hasMany(Row)
Row.belongsTo(List)

Kp.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
User.hasMany(Kp, { foreignKey: 'managerId' });

// Product.hasMany(Row);
// Row.belongsTo(Product);

Event.belongsTo(Contractor, { foreignKey: 'contractorId' });
Contractor.hasMany(Event, { foreignKey: 'contractorId' });

Kp.belongsTo(Contractor, { foreignKey: 'contractorId', as: 'contractor' });
Contractor.hasMany(Kp, { foreignKey: 'contractorId' });

module.exports = {
    Kp, List, Row, User, Contractor, Event,
}