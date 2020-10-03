'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('news', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      contributor: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.GEOMETRY
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      title: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('news');
  }
};