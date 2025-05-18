'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('expenses', 'id_bank', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'id_user',
      references: {
        model: 'banks',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('expenses', 'id_bank');
  }
};
