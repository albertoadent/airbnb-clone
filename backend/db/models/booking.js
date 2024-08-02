"use strict";

const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Spot,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.User,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        set(value) {
          this.setDataValue("startDate", formatDate(new Date(value)));
        },
        get() {
          return formatDate(new Date(this.getDataValue("startDate")));
        },
      },
      endDate: {
        type: DataTypes.DATE,
        set(value) {
          this.setDataValue("endDate", formatDate(new Date(value)));
        },
        get() {
          return formatDate(new Date(this.getDataValue("endDate")));
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue("createdAt");
          return date ? date.toISOString().split("T")[0] : null; // Format as YYYY-MM-DD
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue("updatedAt");
          return date ? date.toISOString().split("T")[0] : null; // Format as YYYY-MM-DD
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );
  return Booking;
};
