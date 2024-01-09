require("dotenv").config()

const mongoose = require('mongoose');


const ConnectDB = async (uri) => {
  try {
    await mongoose.connect(uri, { 
        useNewUrlParser: true,
         useUnifiedTopology: true 
        });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = ConnectDB;

