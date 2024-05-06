// const { Sequelize } = require("sequelize");
// const sequelize = require("../db"); // Adjust the path as necessary to where your db.js is located

// const Product = sequelize.define("product", {
//   // Assuming an ID is automatically generated
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//   },
//   price: {
//     type: Sequelize.FLOAT,
//     allowNull: false,
//   },
//   color: {
//     type: Sequelize.STRING,
//     allowNull: true, // Set to false if color is required
//   },
//   quantity: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     defaultValue: 0, // Assuming a default quantity of 0 if not specified
//   },
//   // Add other fields as necessary
// });

// module.exports = Product;

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db"); // Adjust the path as necessary to where your db.js is located
const bcrypt = require('bcrypt');

const User = sequelize.define("user", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

User.signup = async function(fullName, username, password, role) {
  const exist = await this.findOne({ where: { username: username } });

  if (exist) {
    throw Error('Nom d\'utilisateur déjà utilisé, veuillez choisir un autre');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ fullName, username, password: hash, role });

  return user;
}

User.login = async function(username, password) {
  if (!username || !password) {
    throw Error('Tous les champs doivent être remplis');
  }

  const user = await this.findOne({ where: { username } });

  if (!user) {
    throw Error('Nom d\'utilisateur incorrect');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Mot de passe incorrect');
  }

  return user;
}

module.exports = User;
