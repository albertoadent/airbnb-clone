"use strict";

const { Spot } = require("../models");

const spots = [
  {
    ownerId: 1,
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    lat: 37.7749,
    lng: -122.4194,
    name: "Beautiful Spot",
    description: "A beautiful spot in San Francisco",
    price: 200.0,
  },
  {
    ownerId: 2,
    address: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lng: -118.2437,
    name: "Sunny Spot",
    description: "A sunny spot in Los Angeles",
    price: 150.0,
  },
  {
    ownerId: 3,
    address: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lng: -118.2437,
    name: "Sunny",
    description: "A sunny spot in Los Angeles",
    price: 150.0,
  },
  {
    ownerId: 4,
    address: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lng: -118.2437,
    name: "Spot",
    description: "A sunny spot in Los Angeles",
    price: 150.0,
  },
  {
    ownerId: 5,
    address: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lng: -118.2437,
    name: "Los",
    description: "A sunny spot in Los Angeles",
    price: 150.0,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(spots, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      { schema: process.env.SCHEMA, tableName: "Spots" },
      {
        name: {
          [Sequelize.Op.in]: [
            "Sunny Spot",
            "Beautiful Spot",
            "Sunny",
            "Spot",
            "Los",
          ],
        },
      },
      {}
    );
  },
};
