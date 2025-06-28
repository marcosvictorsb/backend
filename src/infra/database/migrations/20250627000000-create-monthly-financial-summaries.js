'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('monthly_financial_summaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reference_month: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(0[1-9]|1[0-2])\/\d{4}$/, // Valida formato MM/YYYY
            msg: 'reference_month deve estar no formato MM/YYYY'
          }
        }
      },
      total_incomes: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      total_expenses: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      balance: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Saldo líquido (total_incomes - total_expenses)'
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // Criar índice composto para performance em consultas por usuário e mês
    await queryInterface.addIndex('monthly_financial_summaries', {
      fields: ['id_user', 'reference_month'],
      unique: true,
      name: 'unique_user_month_summary'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('monthly_financial_summaries');
  }
};
