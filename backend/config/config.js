/**
 * Configuration File
 * Centralized configuration for the application
 */

export const config = {
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/Todo',
    collectionName: 'todo', // This is the collection name you wanted
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
  },

  // API configuration
  api: {
    version: '1.0.0',
    baseUrl: '/api',
    timeout: 10000
  },

  // Todo configuration
  todo: {
    maxTextLength: 500,
    defaultLimit: 50,
    maxLimit: 100
  }
};

export default config;