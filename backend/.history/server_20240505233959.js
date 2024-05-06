require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const sequelize = require('./db'); 
const Product = require('./models/product');
const app = express();
app.use(cors());
app.use(express.json());
const fs = require('fs').promises; // Use the promise-based version of the fs module

// MongoDB connection
mongoose.connect('mongodb://localhost/yourMongoDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Test MySQL (Sequelize) connection
sequelize.authenticate()
  .then(() => console.log('Connection to MySQL has been established successfully.'))
  .catch(err => console.error('Unable to connect to the MySQL database:', err));

// MongoDB schema for images
const ImageSchema = new mongoose.Schema({
  productId: String,
  images: [String],
});
const Image = mongoose.model('Image', ImageSchema);

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage: storage });

// Example endpoint for uploading images (simplified)
app.post('/api/products/:id/images', upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const imagePaths = req.files.map(file => file.path);
    const imageDoc = new Image({ productId: id, images: imagePaths });
    await imageDoc.save();
    res.status(201).json({ message: 'Images uploaded successfully', imageDoc });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/products', upload.array('images'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    // Create the product in MySQL
    const newProduct = await Product.create({ name, description, price });

    // Process uploaded images and save to MongoDB
    const imageBuffers = await Promise.all(req.files.map(async (file) => {
      const buffer = await fs.readFile(file.path);
      return buffer;
    }));
    
    const imageDoc = new Image({ productId: newProduct.id, images: imageBuffers });
    await imageDoc.save(); 
    // const imagePaths = req.files.map(file => file.path); // Get paths of uploaded images
    // const imageDoc = new Image({ productId: newProduct.id, images: imagePaths });
    // await imageDoc.save(); // Save image document in MongoDB

    // Respond with product and image information
    res.status(201).json({ product: newProduct, images: imageDoc });
  } catch (error) {
    console.error('Error creating product and saving images:', error);
    res.status(400).json({ error: 'Failed to create product and save images' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});