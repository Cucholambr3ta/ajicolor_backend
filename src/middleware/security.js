const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const configureSecurity = (app) => {
  // 1. Set Security HTTP Headers
  app.use(helmet());

  // 2. Data Sanitization against NoSQL Injection
  app.use(mongoSanitize());

  // 3. Enable CORS with environment-based whitelist
  const corsOptions = {
    origin: (origin, callback) => {
      const whitelist =
        process.env.NODE_ENV === "development"
          ? [
              "http://localhost:8080",
              "http://localhost:3000",
              process.env.CLIENT_URL,
            ]
          : [process.env.CLIENT_URL];

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  app.use(cors(corsOptions));

  // 4. Rate Limiting - Dual Strategy
  // Strict limiter for authentication endpoints (prevent brute-force)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15min per IP
    message: "Too many authentication attempts, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // General API limiter
  const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

  app.use("/api", generalLimiter);

  // Export authLimiter for use in auth routes
  app.locals.authLimiter = authLimiter;
};

module.exports = configureSecurity;
