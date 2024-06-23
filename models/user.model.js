const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { createToken, hashToken } = require("../utils/token");

const User = sequelize.define(
  "user",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      enum: ["user", "driver", "admin", "superadmin"],
      defaultValue: "user",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: [
          "password",
          "passwordResetToken",
          "passwordResetTokenExpires",
          "verificationToken",
        ],
      },
    },
  }
);

User.prototype.getFullName = function () {
  return `${this.firstname} ${this.lastname}`;
};

User.prototype.toJSON = function () {
  const attributes = Object.assign({}, this.get());
  delete attributes.password;
  delete attributes.passwordResetToken;
  delete attributes.passwordResetTokenExpires;
  delete attributes.verificationToken;
  return attributes;
};

User.prototype.createPasswordResetToken = function () {
  const resetToken = createToken("hex");

  this.passwordResetToken = hashToken(resetToken);

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

User.prototype.isUserPasswordResetTokenValid = function (token) {
  const hashedToken = hashToken(token);

  return (
    hashedToken === this.passwordResetToken &&
    this.passwordResetTokenExpires > Date.now()
  );
};

module.exports = User;
