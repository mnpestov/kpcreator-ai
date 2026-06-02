'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();

    // 1. Users
    if (!tables.includes('Users')) {
      await queryInterface.createTable('Users', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: Sequelize.STRING, allowNull: true },
        password: { type: Sequelize.STRING, allowNull: false },
        name: { type: Sequelize.STRING, allowNull: false },
        job: { type: Sequelize.STRING, allowNull: true },
        tel: { type: Sequelize.STRING, unique: true, allowNull: false },
        photo: { type: Sequelize.STRING, allowNull: true },
        role: { type: Sequelize.ENUM('manager', 'admin'), defaultValue: 'manager' },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    // 2. kps
    if (!tables.includes('kps')) {
      await queryInterface.createTable('kps', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        kpNumber: { type: Sequelize.STRING, unique: true },
        kpDate: { type: Sequelize.DATEONLY },
        contractNumber: { type: Sequelize.STRING },
        contractDate: { type: Sequelize.DATEONLY },
        startEvent: { type: Sequelize.DATEONLY },
        endEvent: { type: Sequelize.DATEONLY },
        eventPlace: { type: Sequelize.STRING },
        countOfPerson: { type: Sequelize.STRING },
        isWithinMkad: { type: Sequelize.BOOLEAN, defaultValue: true },
        logisticsCost: { type: Sequelize.INTEGER },
        listTitle: { type: Sequelize.STRING },
        managerName: { type: Sequelize.STRING, allowNull: false },
        managerId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    // 3. lists
    if (!tables.includes('lists')) {
      await queryInterface.createTable('lists', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        startEvent: { type: Sequelize.DATEONLY, allowNull: false },
        endEvent: { type: Sequelize.DATEONLY, allowNull: false },
        startTimeStartEvent: { type: Sequelize.TIME, allowNull: false },
        endTimeStartEvent: { type: Sequelize.TIME, allowNull: false },
        startTimeEndEvent: { type: Sequelize.TIME, allowNull: false },
        endTimeEndEvent: { type: Sequelize.TIME, allowNull: false },
        eventPlace: { type: Sequelize.STRING, allowNull: false },
        countOfPerson: { type: Sequelize.STRING, allowNull: false },
        listTitle: { type: Sequelize.STRING },
        kpId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'kps', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    // 4. rows
    if (!tables.includes('rows')) {
      await queryInterface.createTable('rows', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        product: { type: Sequelize.STRING, allowNull: false },
        composition: { type: Sequelize.STRING },
        productWeight: { type: Sequelize.INTEGER, allowNull: true },
        countOfProduct: { type: Sequelize.INTEGER, allowNull: false },
        priceOfProduct: { type: Sequelize.INTEGER, allowNull: false },
        typeOfProduct: { type: Sequelize.STRING },
        listId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'lists', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('rows')) await queryInterface.dropTable('rows');
    if (tables.includes('lists')) await queryInterface.dropTable('lists');
    if (tables.includes('kps')) await queryInterface.dropTable('kps');
    if (tables.includes('Users')) {
      await queryInterface.dropTable('Users');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
    }
  }
};
