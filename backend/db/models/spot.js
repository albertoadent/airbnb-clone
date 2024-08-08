"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    async getPreviewImage() {
      const [previewImage] = await this.getSpotImages({
        where: {
          preview: true,
        },
      });
      return previewImage.toJSON().url;
    }

    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "Owner",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: "spotId",
        otherKey: "userId",
        as: "WhoBooked",
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.User,
        },
      },
      address: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      country: DataTypes.STRING,
      lat: {
        type: DataTypes.DECIMAL,
        get() {
          return parseFloat(this.getDataValue("lat"));
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        get() {
          return parseFloat(this.getDataValue("lng"));
        },
      },
      name: { type: DataTypes.STRING },
      description: { type: DataTypes.STRING },
      price: {
        type: DataTypes.DECIMAL,
        get() {
          return parseFloat(this.getDataValue("price"));
        },
      },
      previewImage: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("previewImage");
        },
      },
      avgRating: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("avgRating");
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue("createdAt");
          return date ? date.toISOString().split("T")[0] : null;
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue("updatedAt");
          return date ? date.toISOString().split("T")[0] : null;
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      hooks: {
        afterFind: async (result, options) => {
          const spots = Array.isArray(result) ? result : [result];

          for (const spot of spots) {
            // Check if spot is not null (in case of findOne returning null)
            if (spot) {
              const image = await sequelize.models.SpotImage.findOne({
                where: { spotId: spot.id, preview: true },
              });

              const reviews = await sequelize.models.Review.findAll({
                where: { spotId: spot.id },
              });

              const numReviews = reviews?.length || 1;
              const average =
                reviews?.reduce((tot, review) => tot + review.stars, 0) ||
                0 / numReviews;

              spot.setDataValue("previewImage", image ? image.url : null);
              spot.setDataValue("avgRating", average ? average : null);
            }
          }
        },
      },
    }
  );
  return Spot;
};
