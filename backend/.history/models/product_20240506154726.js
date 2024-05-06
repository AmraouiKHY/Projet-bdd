const { Sequelize } = require("sequelize");
const sequelize = require("../db"); // Adjust the path as necessary to where your db.js is located

const Product = sequelize.define("product", {
  // Assuming an ID is automatically generated
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: true, // Set to false if color is required
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0, // Assuming a default quantity of 0 if not specified
  },
  // Add other fields as necessary
});

module.exports = Product;
