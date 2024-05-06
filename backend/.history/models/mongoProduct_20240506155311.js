const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  // Add other fields as necessary
}, {
  timestamps: true,
});

const MongoProduct = mongoose.model('Product', ProductSchema);

module.exports = MongoProduct;