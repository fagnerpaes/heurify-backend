import { config } from '../src/config/env.js';

// Setup environment for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '3001';
