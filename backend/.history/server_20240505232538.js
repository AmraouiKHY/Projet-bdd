require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const sequelize = require('./db'); // Adjust the path as necessary

const app = express();
app.use(cors());
app.use(express.json());

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});