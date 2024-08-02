"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Review.init(
    {
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
      review: { type: DataTypes.STRING, allowNull: false },
      stars: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue('createdAt');
          return date ? date.toISOString().split('T')[0] : null; // Format as YYYY-MM-DD
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue('updatedAt');
          return date ? date.toISOString().split('T')[0] : null; // Format as YYYY-MM-DD
        }
      },
    },
    {
      sequelize,
      modelName: "Review",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );
  return Review;
};
