'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'banks', 
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        amount: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        id_user:{
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATEONLY,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('banks');  
  }
};
