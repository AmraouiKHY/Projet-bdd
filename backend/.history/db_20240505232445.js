const { Sequelize } = require('sequelize');

// Replace these with your actual database connection details
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql', // or another supported database
});

module.exports = sequelize;