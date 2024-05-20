const { DataTypes } = require("sequelize");
const sequelize = require("./../config/database");
const User = require("./user.model");

const Package = sequelize.define(
  "Package",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemType: {
      type: DataTypes.ENUM(["normal", "delicate", "vip"]),
      allowNull: false,
      defaultValue: "normal",
    },
    status: {
      type: DataTypes.ENUM([
        "pending",
        "in-transit",
        "out-for-delivery",
        "delivered",
        "cancelled",
        "returned",
        "delayed",
      ]),
      defaultValue: "pending",
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    senderAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    senderLongitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    receiverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    receiverLongitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeSave: (package) => {
        // Calculate price based on package type, weight, and distance
        const basePriceByType = {
          normal: 2000, // Base price for normal package
          delicate: 3500, // Base price for delicate package
          VIP: 5000, // Base price for VIP package
        };

        const basePrice = basePriceByType[package.itemType];
        const weightPrice = package.weight * 0.5; // Example: $0.5 per kg

        // Calculate distance between sender and receiver locations (Example: using Haversine formula)
        const distance = calculateDistance(
          package.senderLatitude,
          package.senderLongitude,
          package.receiverLatitude,
          package.receiverLongitude
        );

        // Example: Distance-based pricing tiers
        let distancePrice = 0;
        if (distance < 5) {
          distancePrice = 1000; // Example: $2 for distance less than 5km
        } else if (distance >= 5 && distance < 10) {
          distancePrice = 2500; // Example: $5 for distance between 5km and 10km
        } else {
          distancePrice = 4000; // Example: $10 for distance greater than or equal to 10km
        }

        // Calculate total price
        package.price = basePrice + weightPrice + distancePrice;
      },
    },
  }
);

// Function to calculate distance using Haversine formula (Example)
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

Package.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Package, {
  as: "sender",
  foreignKey: "senderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
module.exports = Package;
