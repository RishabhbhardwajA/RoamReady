const app = require('./src/app');
const env = require('./src/config/env');
const { connectDB } = require('./src/config/db');

const startServer = async () => {
  // Attempt MongoDB connection (resilient fallback active if offline)
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`====================================================`);
    console.log(`✈️  RoamReady Travel Gear Backend Server Running`);
    console.log(`🌐 Port: http://localhost:${env.PORT}`);
    console.log(`🩺 Health: http://localhost:${env.PORT}/api/health`);
    console.log(`📦 Environment: ${env.NODE_ENV}`);
    console.log(`====================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
};

startServer();
