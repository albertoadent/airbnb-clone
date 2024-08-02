"use strict";

const { SpotImage } = require("../models");

const spotImages = [
  {
    spotId: 1,
    url: "http://example.com/spot1.jpg",
    preview: true,
  },
  {
    spotId: 2,
    url: "http://example.com/spot2.jpg",
    preview: true,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      { schema: process.env.SCHEMA, tableName: "SpotImages" },
      {
        url: {
          [Sequelize.Op.in]: [
            "http://example.com/spot1.jpg",
            "http://example.com/spot2.jpg",
          ],
        },
      },
      {}
    );
  },
};
