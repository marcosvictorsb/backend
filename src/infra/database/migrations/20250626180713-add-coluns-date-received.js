'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('incomes', 'date_received', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'status'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('incomes', 'date_received');
  }
};
