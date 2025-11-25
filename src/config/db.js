const mongoose = require('mongoose');
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);

    // En serverless, no usar process.exit ya que mata la función
    // Lanzar el error para que el error handler de Express lo maneje
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      throw error;
    }

    // En desarrollo local, sí podemos usar exit
    process.exit(1);
  }
};

module.exports = connectDB;
