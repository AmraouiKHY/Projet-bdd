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

  Product.sync().then(() => {
    console.log('Product table created successfully.');
  }).catch((error) => {
    console.error('Error creating Product table:', error);
  });
// MongoDB schema for images
const ImageSchema = new mongoose.Schema({
  productId: String,
  images: [{
    data: String, // Base64 encoded data
    file_name: String,
    file_size: Number,
    file_type: String,
  }],
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

// Endpoint for creating products
app.post('/api/products', upload.array('images'), async (req, res) => {
  try {
    const { name, description, price, color, quantity } = req.body;
    console.log('Received product data:', { name, description, price, color, quantity }); 

    // Create the product in MySQL/Sequelize
    const newProduct = await Product.create({ name, description, price, color, quantity });

    // Prepare image data including file_name, file_size, and file_type
    const imagesData = await Promise.all(req.files.map(async (file) => {
      const buffer = await fs.readFile(file.path);
      return {
        data: buffer.toString('base64'),
        file_name: file.originalname,
        file_size: file.size,
        file_type: file.mimetype,
      };
    }));

    // Save the image data in MongoDB
    const imageDoc = new Image({ productId: newProduct.id, images: imagesData });
    await imageDoc.save();

    // Respond with product and image information
    res.status(201).json({ product: newProduct, images: imageDoc });
  } catch (error) {
    console.error('Error creating product and saving images:', error);
    res.status(400).json({ error: 'Failed to create product and save images' });
  }
});app.get('/api/products', async (req, res) => {
  try {
    // Fetch all products from MySQL using Sequelize
    const products = await Product.findAll();

    // Function to fetch images for a product from MongoDB
    const fetchImagesForProduct = async (productId) => {
      // Fetch images from MongoDB where the images' productId matches
      const imageDocs = await Image.find({ productId: productId.toString() });
      // Map over each imageDoc to extract the necessary fields
      return imageDocs.map(doc => doc.images.map(img => ({
        data: img.data, // Assuming this is the base64 encoded data
        file_name: img.file_name,
        file_size: img.file_size,
        file_type: img.file_type,
      }))).flat(); // Flatten in case there are multiple imageDocs per product
    };

    // Manually combine products with their images
    const productsWithImages = await Promise.all(products.map(async (product) => {
      const images = await fetchImagesForProduct(product.id);
      return {
        ...product.toJSON(), // Convert Sequelize model instance to plain object
        images: images, // Add images to the product object
      };
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});