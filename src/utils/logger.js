const winston = require('winston');

// Detectar si estamos en un entorno serverless (Vercel, AWS Lambda, etc.)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTION_NAME;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'app-poleras-backend' },
  transports: [],
});

// En entornos serverless o producción, solo usar console (stdout/stderr)
// Vercel captura automáticamente los logs de console
if (process.env.NODE_ENV === 'production' || isServerless) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }));
} else {
  // En desarrollo, usar tanto archivos como consola
  logger.add(new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error' 
  }));
  logger.add(new winston.transports.File({ 
    filename: 'logs/combined.log' 
  }));
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
