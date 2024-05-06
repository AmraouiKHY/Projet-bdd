// require('dotenv').config()
// //express app

// const express =require('express')
// const app = express()
// const cors = require('cors');


// app.use(cors());
// //import mongoose
// const mongoose = require('mongoose')


// const port = process.env.PORT || 5000;
// //import routers 
// // exemple :const visitRoutes=require('./routes/visitsRoutes')
// const authRoutes=require('./routes/authRoutes')
// const accountRoutes=require('./routes/accountRoutes')




// //middleware
// app.use(express.json())
// app.use((req, res,next)=>{
//      console.log(req.path ,req.method)
//     next()
// })
 


// //routes

// app.use('/api/auth',authRoutes)
// app.use('/api/account',accountRoutes)


// //connect to db
// mongoose.connect(process.env.DB_URI).then(()=>{
//     //listen for requests
//     app.listen(port,()=>{
//         console.log('listening... ',port)
//     })
// }).catch((err)=>{
//     console.log(err)
// })

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/yourMongoDB', { useNewUrlParser: true, useUnifiedTopology: true });

// MySQL (Sequelize) connection
const sequelize = new Sequelize('yourMySQLDB', 'yourUser', 'yourPassword', {
  host: 'localhost',
  dialect: 'mysql',
});

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
