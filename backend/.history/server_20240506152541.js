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
const fs = require('fs').promises;

mongoose.connect('mongodb://localhost/yourMongoDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

sequelize.authenticate()
  .then(() => console.log('Connection to MySQL has been established successfully.'))
  .catch(err => console.error('Unable to connect to the MySQL database:', err));

  Product.sync().then(() => {
    console.log('Product table created successfully.');
  }).catch((error) => {
    console.error('Error creating Product table:', error);
  });
const ImageSchema = new mongoose.Schema({
  productId: String,
  images: [{
    data: String, 
    file_name: String,
    file_size: Number,
    file_type: String,
  }],
});
const Image = mongoose.model('Image', ImageSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage: storage });

const authRoutes=require('./routes/authRoutes')

app.use('/api/auth',authRoutes)

app.post('/api/products', upload.array('images'), async (req, res) => {
  try {
    const { name, description, price, color, quantity } = req.body;
    console.log('Received product data:', { name, description, price, color, quantity }); 

    const newProduct = await Product.create({ name, description, price, color, quantity });

    const imagesData = await Promise.all(req.files.map(async (file) => {
      const buffer = await fs.readFile(file.path);
      return {
        data: buffer.toString('base64'),
        file_name: file.originalname,
        file_size: file.size,
        file_type: file.mimetype,
      };
    }));

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
    const products = await Product.findAll();

    const fetchImagesForProduct = async (productId) => {
      const imageDocs = await Image.find({ productId: productId.toString() });
      return imageDocs.map(doc => doc.images.map(img => ({
        data: img.data,
        file_name: img.file_name,
        file_size: img.file_size,
        file_type: img.file_type,
      }))).flat(); 
    };

    const productsWithImages = await Promise.all(products.map(async (product) => {
      const images = await fetchImagesForProduct(product.id);
      return {
        ...product.toJSON(), 
        images: images, 
      };
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Error fetching products.:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/migrate', async (req, res) => {
  try {
    // Fetch all products from MySQL
    const mysqlProducts = await Product.findAll();

    // Transform the data into a format suitable for MongoDB
    const transformedData = mysqlProducts.map(product => ({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      color: product.color,
      quantity: product.quantity,
    }));

    // Insert the transformed data into MongoDB
    await Product.insertMany(transformedData);

    res.status(200).json({ message: 'Data migration completed successfully' });
  } catch (err) {
    console.error('Failed to migrate data:', err);
    res.status(500).json({ error: 'Failed to migrate data' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});