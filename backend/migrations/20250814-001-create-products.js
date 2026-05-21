'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      composition: { type: Sequelize.TEXT },
      productWeight: { type: Sequelize.STRING },
      typeOfProduct: { type: Sequelize.STRING },
      priceOfProduct: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      description: { type: Sequelize.TEXT },
      photo: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['typeOfProduct']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  }
};
