const { Sequelize } = require('sequelize');

// Replace these with your actual database connection details
const sequelize = new Sequelize('bddd', 'root', 'rot', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;