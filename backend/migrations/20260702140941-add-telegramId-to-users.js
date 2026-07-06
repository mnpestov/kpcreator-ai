'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'telegramId', {
      type: Sequelize.STRING,
      allowNull: true
    });
    // Единственный unique-индекс: и для уникальности, и для быстрого поиска при авторизации
    await queryInterface.addIndex('Users', ['telegramId'], {
      name: 'users_telegramId_index',
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Users', 'users_telegramId_index');
    await queryInterface.removeColumn('Users', 'telegramId');
  }
};
