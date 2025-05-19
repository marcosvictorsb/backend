'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      color: {
        type: Sequelize.STRING,
        defaultValue: '#000000'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};
