import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Heurify Backend API',
      version: '0.1.0',
      description: 'RESTful API for managing test heuristics, charters, and SBTM sessions',
      contact: {
        name: 'Heurify Team',
        url: 'https://github.com/heurify',
      },
    },
    servers: [
      {
        url: `${config.swaggerSchemes[0]}://${config.swaggerHost}`,
        description: config.isDevelopment() ? 'Development server' : 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                },
                details: {
                  type: 'object',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            nome: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['admin', 'editor', 'viewer'],
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Heuristica: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            technique: {
              type: 'string',
            },
            applicationScenario: {
              type: 'string',
            },
            examples: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            riskNotes: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            status: {
              type: 'string',
              enum: ['draft', 'reviewed', 'approved', 'archived'],
            },
            criadoPor: {
              type: 'string',
              format: 'uuid',
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
            },
            atualizadoEm: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    'src/controllers/*.js',
    'src/routes/*.js',
  ],
};

export const specs = swaggerJsdoc(swaggerOptions);
