"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        references: {
          model: sequelize.models.Spot,
        },
      },
      url: { type: DataTypes.STRING, allowNull: false },
      preview: { type: DataTypes.BOOLEAN, allowNull: false },
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
      modelName: "SpotImage",
      timestamps:true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );
  return SpotImage;
};
