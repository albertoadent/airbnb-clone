"use strict";

const { ReviewImage } = require("../models");

const reviewImages = [
  {
    reviewId: 1,
    url: "http://example.com/review1.jpg",
  },
  {
    reviewId: 2,
    url: "http://example.com/review2.jpg",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      { schema: process.env.SCHEMA, tableName: "ReviewImages" },
      {
        id: {
          [Sequelize.Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
