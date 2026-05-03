import { formatSuccess } from '../utils/helpers.js';

export const getHealth = (req, res) => {
  const healthStatus = {
    status: 'UP',
    service: 'heurify-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(formatSuccess(healthStatus));
};

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: UP
 *                     service:
 *                       type: string
 *                       example: heurify-backend
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
