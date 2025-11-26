const winston = require('winston');
const path = require("path");

// Detectar si estamos en un entorno serverless o producción
// En Vercel, NODE_ENV siempre es 'production'
const isProduction = process.env.NODE_ENV === "production";
const isServerless =
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.FUNCTION_NAME;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "app-poleras-backend" },
  transports: [],
});

// En entornos serverless o producción, SOLO usar console (stdout/stderr)
// Vercel captura automáticamente los logs de console
if (isProduction || isServerless) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
} else {
  // En desarrollo local, usar archivos Y consola
  // Solo intentar crear archivos en desarrollo local
  try {
    logger.add(
      new winston.transports.File({
        filename: path.join(process.cwd(), "logs", "error.log"),
        level: "error",
      })
    );
    logger.add(
      new winston.transports.File({
        filename: path.join(process.cwd(), "logs", "combined.log"),
      })
    );
  } catch (error) {
    // Si falla crear archivos, solo usar console
    console.warn(
      "Could not create log files, using console only:",
      error.message
    );
  }

  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
