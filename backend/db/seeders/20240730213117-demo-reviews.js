"use strict";

const { Review } = require("../models");

const reviews = [
  {
    spotId: 1,
    userId: 1,
    review: "Great place to stay!",
    stars: 5,
  },
  {
    spotId: 2,
    userId: 2,
    review: "Very comfortable and clean.",
    stars: 4,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(reviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      { schema: process.env.SCHEMA, tableName: "Reviews" },
      {
        id: {
          [Sequelize.Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
