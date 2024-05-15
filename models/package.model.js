const { DataTypes } = require("sequelize");
const sequelize = require("./../config/database");

const Package = sequelize.define("Package", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    // TODO:
    type: DataTypes.ENUM(""),
  },
});
