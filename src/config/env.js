const dotenv = require('dotenv');
const path = require('path');

// Load environment variables only if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

// Validation function
const validateEnv = () => {
  const required = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT || "3000",
    JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || "10",
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:8080",
  };

  // Critical variables that MUST exist
  const critical = ["MONGO_URI", "JWT_SECRET"];

  const missing = critical.filter((key) => !required[key]);

  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV !== 'production') {
      console.error("❌ CRITICAL:", errorMsg);
      console.error("\nPlease create a .env file based on .env.example");
      process.exit(1);
    } else {
      // In production (Vercel), throw error but don't process.exit
      throw new Error(errorMsg);
    }
  }

  // Validate JWT secret strength
  if (required.JWT_SECRET && required.JWT_SECRET.length < 32) {
    const errorMsg = `JWT_SECRET is too weak! Must be 32+ characters. Current length: ${required.JWT_SECRET.length}`;
    if (process.env.NODE_ENV !== 'production') {
      console.error("❌ FATAL:", errorMsg);
      process.exit(1);
    } else {
      throw new Error(errorMsg);
    }
  }

  // Warn about defaults
  if (!process.env.BCRYPT_ROUNDS) {
    console.warn("⚠️  Using default BCRYPT_ROUNDS: 10");
  }

  return required;
};

// Export validated config
module.exports = validateEnv();
