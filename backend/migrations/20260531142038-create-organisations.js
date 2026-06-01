'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create organisations table
    await queryInterface.createTable('organisations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 2. Move data from menuItems to organisations
    // Note: If you don't have createdAt and updatedAt in menuItems, this might fail.
    // Assuming menuItems has standard timestamps.
    const [results, metadata] = await queryInterface.sequelize.query(
      `INSERT INTO "organisations" ("title", "description", "price", "active", "createdAt", "updatedAt")
       SELECT "title", "description", "price", "active", "createdAt", "updatedAt"
       FROM "menuItems"
       WHERE "category" = 'organisation';`
    );

    // 3. Delete moved data from menuItems
    await queryInterface.sequelize.query(
      `DELETE FROM "menuItems" WHERE "category" = 'organisation';`
    );
  },

  async down(queryInterface, Sequelize) {
    // 1. Move data back to menuItems
    await queryInterface.sequelize.query(
      `INSERT INTO "menuItems" ("title", "description", "price", "active", "category", "createdAt", "updatedAt")
       SELECT "title", "description", "price", "active", 'organisation', "createdAt", "updatedAt"
       FROM "organisations";`
    );

    // 2. Drop organisations table
    await queryInterface.dropTable('organisations');
  }
};
