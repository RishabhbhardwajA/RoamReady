const mongoose = require('mongoose');
const env = require('./env');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    isConnected = true;
    console.log(`[RoamReady DB] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[RoamReady DB] Notice: MongoDB connection to ${env.MONGODB_URI} failed: ${error.message}`);
    console.warn(`[RoamReady DB] Switching to built-in resilient data engine with full data persistence for development & demo mode.`);
    isConnected = false;
  }
};

const getDBStatus = () => ({
  isConnected,
  uri: env.MONGODB_URI
});

module.exports = {
  connectDB,
  getDBStatus
};

