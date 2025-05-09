'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'incomes', 
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        amount: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        reference_month: {
          type: Sequelize.STRING(),
          allowNull: false,
          validate: {
            is: {
              args: /^(0[1-9]|1[0-2])\/\d{4}$/, // Valida formato MM/YYYY
              msg: 'reference_month deve estar no formato MM/YYYY'
            }
          },
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        id_user: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATEONLY,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        }
      },
    )
  },

  async down (queryInterface) {
    await queryInterface.dropTable('incomes');  
  }
};
