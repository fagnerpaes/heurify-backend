import Joi from 'joi';

/**
 * Login request validation schema
 * @type {Joi.ObjectSchema}
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ser válido',
      'any.required': 'Email é obrigatório',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'any.required': 'Senha é obrigatória',
    }),
});

/**
 * Register request validation schema
 * @type {Joi.ObjectSchema}
 */
export const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.min': 'Nome deve ter no mínimo 3 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ser válido',
      'any.required': 'Email é obrigatório',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'any.required': 'Senha é obrigatória',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirmação de senha deve ser igual à senha',
      'any.required': 'Confirmação de senha é obrigatória',
    }),
});
