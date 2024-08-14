"use strict";

const { SpotImage } = require("../models");

const spotImages = [
  {
    spotId: 1,
    url: "https://assets3.thrillist.com/v1/image/3150946/1000x666/flatten;crop;webp=auto;jpeg_quality=60.jpg",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://media-cdn.tripadvisor.com/media/photo-s/1d/11/68/9f/exterior-signage.jpg",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/84/3b/1d/caption.jpg?w=1200&h=1600&s=1",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://cdn.britannica.com/30/94430-050-D0FC51CD/Niagara-Falls.jpg",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://cdn.britannica.com/30/94430-050-D0FC51CD/Niagara-Falls.jpg",
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
            "https://assets3.thrillist.com/v1/image/3150946/1000x666/flatten;crop;webp=auto;jpeg_quality=60.jpg",
            "https://media-cdn.tripadvisor.com/media/photo-s/1d/11/68/9f/exterior-signage.jpg",
          ],
        },
      },
      {}
    );
  },
};
