'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('expenses', 'date_payment', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'id_bank',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('expenses', 'date_payment');
  }
};
