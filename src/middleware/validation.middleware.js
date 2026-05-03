import Joi from 'joi';
import { formatError } from '../utils/helpers.js'; // Importe o seu helper
import { ERROR_CODES } from '../config/error-codes.js';

export const createValidator = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        type: err.type,
      }));

      // Use o formatError para garantir que o 'success: false' seja incluído
      return res.status(400).json(
        formatError(ERROR_CODES.VALIDATION_ERROR, 'Validation failed', details)
      );
    }

    req.body = value; // <-- ADICIONE ESTA LINHA: atualiza o body com valores convertidos/limpos
    req.validatedBody = value;
    next();
  };
};

export const createQueryValidator = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        type: err.type,
      }));

      return res.status(400).json(
        formatError(ERROR_CODES.VALIDATION_ERROR, 'Validation failed', details)
      );
    }

    req.query = value; // <-- ADICIONE ESTA LINHA: transforma "?limit=10" (string) em 10 (number)
    req.validatedQuery = value;
    next();
  };
};
