'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'startEvent', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn('Events', 'endEvent', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn('Events', 'startTimeStartEvent', {
      type: Sequelize.TIME,
      allowNull: true
    });
    await queryInterface.addColumn('Events', 'endTimeStartEvent', {
      type: Sequelize.TIME,
      allowNull: true
    });
    await queryInterface.addColumn('Events', 'startTimeEndEvent', {
      type: Sequelize.TIME,
      allowNull: true
    });
    await queryInterface.addColumn('Events', 'endTimeEndEvent', {
      type: Sequelize.TIME,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'startEvent');
    await queryInterface.removeColumn('Events', 'endEvent');
    await queryInterface.removeColumn('Events', 'startTimeStartEvent');
    await queryInterface.removeColumn('Events', 'endTimeStartEvent');
    await queryInterface.removeColumn('Events', 'startTimeEndEvent');
    await queryInterface.removeColumn('Events', 'endTimeEndEvent');
  }
};
