const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://MSUmail:database123455@cluster0.to4jdd4.mongodb.net/FacemaskDB?retryWrites=true&w=majority';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;