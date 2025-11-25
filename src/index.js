const express = require('express');
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const configureSecurity = require("./middleware/security");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Rutas
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const postRoutes = require("./routes/postRoutes");
const healthRoutes = require("./routes/healthRoutes");

dotenv.config();

// Validar variables de entorno al inicio
try {
  validateEnv();
  logger.info("Environment variables validated successfully");
} catch (error) {
  logger.error(`Environment validation failed: ${error.message}`);
  // En serverless, continuar para que el error handler pueda responder
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    throw error;
  }
}

// Conectar a Base de Datos (Skip in test mode for mongodb-memory-server)
if (process.env.NODE_ENV !== "test") {
  connectDB().catch((err) => {
    logger.error(`Failed to connect to database: ${err.message}`);
    // En serverless, no podemos exit, solo logear
  });
}

const app = express();

// Body Parser with limit to prevent DoS
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "../public")));

// Apply Security Middleware (Helmet, CORS, RateLimit, MongoSanitize)
configureSecurity(app);

// Rutas
app.use("/api/health", healthRoutes);
app.use("/api/v1/productos", productRoutes);
app.use("/api/v1/usuarios", authRoutes);
app.use("/api/v1/pedidos", orderRoutes);
app.use("/api/v1/posts", postRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("API de App Poleras funcionando...");
});

// Global Error Handler (MUST be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app; // Para tests
