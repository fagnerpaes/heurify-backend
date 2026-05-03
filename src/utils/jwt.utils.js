import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { JWT_CONFIG } from '../config/constants.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    ...JWT_CONFIG,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret, JWT_CONFIG);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
