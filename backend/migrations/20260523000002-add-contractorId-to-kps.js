'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('kps', 'contractorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Contractors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('kps', 'contractorId');
  }
};
