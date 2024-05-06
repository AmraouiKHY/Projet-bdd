const Product = sequelize.define('product', {
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
    // Add other fields as necessary
  });