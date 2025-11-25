const dotenv = require('dotenv');
const path = require('path');

// Load environment variables only if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

// Validation function - puede ser llamada después de que la app se inicialice
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
    
    // En Vercel, dar instrucciones claras
    if (process.env.VERCEL) {
      throw new Error(
        `${errorMsg}\n\n` +
        `Configure estas variables en Vercel Dashboard:\n` +
        `Project Settings > Environment Variables\n` +
        `https://vercel.com/docs/environment-variables`
      );
    }
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
    
    // En desarrollo local
    console.error("❌ CRITICAL:", errorMsg);
    console.error("\nPlease create a .env file based on .env.example");
    process.exit(1);
  }

  // Validate JWT secret strength
  if (required.JWT_SECRET && required.JWT_SECRET.length < 32) {
    const errorMsg = `JWT_SECRET is too weak! Must be 32+ characters. Current length: ${required.JWT_SECRET.length}`;
    throw new Error(errorMsg);
  }

  // Warn about defaults (solo en desarrollo)
  if (!process.env.BCRYPT_ROUNDS && process.env.NODE_ENV !== 'production') {
    console.warn("⚠️  Using default BCRYPT_ROUNDS: 10");
  }

  return required;
};

// Getter seguro que no lanza en la inicialización
const getEnvConfig = () => {
  return {
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
};

// Export both the validation function and config getter
module.exports = {
  validateEnv,
  getEnvConfig,
  // Para compatibilidad, también exportar config directamente
  // pero sin validar en la carga del módulo
  ...getEnvConfig()
};
