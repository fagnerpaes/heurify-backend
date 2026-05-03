import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',

  // Swagger
  swaggerHost: process.env.SWAGGER_HOST || 'localhost:3000',
  swaggerSchemes: (process.env.SWAGGER_SCHEMES || 'http').split(','),

  // Environment checks
  isDevelopment() {
    return this.nodeEnv === 'development';
  },

  isProduction() {
    return this.nodeEnv === 'production';
  },
};
