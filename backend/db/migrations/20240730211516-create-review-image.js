"use strict";

const options = {
  schema:
    process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReviewImages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reviewId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Reviews"
        }
      },
      url: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.dropTable(options);
  },
};
