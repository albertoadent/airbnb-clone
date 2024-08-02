"use strict";

const { Booking } = require("../models");

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-08-07"),
  },
  {
    spotId: 2,
    userId: 2,
    startDate: new Date("2024-08-05"),
    endDate: new Date("2024-08-10"),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(bookings, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      { schema: process.env.SCHEMA, tableName: "Bookings" },
      {
        id: {
          [Sequelize.Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
