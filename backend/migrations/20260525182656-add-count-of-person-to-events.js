'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Add countOfPerson to Events table
    await queryInterface.addColumn('Events', 'countOfPerson', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Perform lightweight data migration from lists -> kps -> Events
    // Extract first contiguous digits from lists.countOfPerson and cast to INTEGER
    // Only migrate where Events.countOfPerson is null
    await queryInterface.sequelize.query(`
      UPDATE "Events" e
      SET "countOfPerson" = CAST(NULLIF(substring(l."countOfPerson" from '[0-9]+'), '') AS INTEGER)
      FROM kps k
      JOIN lists l ON l."kpId" = k.id
      WHERE k."eventId" = e.id
        AND e."countOfPerson" IS NULL
        AND l."countOfPerson" IS NOT NULL;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'countOfPerson');
  }
};
