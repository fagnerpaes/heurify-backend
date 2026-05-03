import Joi from 'joi';

/**
 * Create charter validation schema
 * @type {Joi.ObjectSchema}
 */
export const createCharterSchema = Joi.object({
  titulo: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Título do charter deve ter no mínimo 5 caracteres',
      'string.max': 'Título do charter deve ter no máximo 200 caracteres',
      'any.required': 'Título é obrigatório',
    }),
  objetivo: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Objetivo deve ter no mínimo 10 caracteres',
      'string.max': 'Objetivo deve ter no máximo 1000 caracteres',
      'any.required': 'Objetivo é obrigatório',
    }),
  escopo: Joi.string()
    .min(10)
    .max(1500)
    .required()
    .messages({
      'string.min': 'Escopo deve ter no mínimo 10 caracteres',
      'string.max': 'Escopo deve ter no máximo 1500 caracteres',
      'any.required': 'Escopo é obrigatório',
    }),
  duracao: Joi.number()
    .integer()
    .min(30)
    .max(480)
    .required()
    .messages({
      'number.min': 'Duração mínima é 30 minutos',
      'number.max': 'Duração máxima é 480 minutos',
      'any.required': 'Duração é obrigatória',
    }),
  heuristicasIds: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .min(1)
    .max(20)
    .required()
    .messages({
      'array.min': 'Pelo menos uma heurística deve ser selecionada',
      'array.max': 'Máximo 20 heurísticas por charter',
      'any.required': 'Lista de heurísticas é obrigatória',
    }),
  ambienteTestado: Joi.string()
    .min(5)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Ambiente deve ter no mínimo 5 caracteres',
      'string.max': 'Ambiente deve ter no máximo 100 caracteres',
    }),
  versaoApp: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Versão deve ter no máximo 50 caracteres',
    }),
  observacoes: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Observações deve ter no máximo 1000 caracteres',
    }),
}).strict();

/**
 * Update charter validation schema
 * @type {Joi.ObjectSchema}
 */
export const updateCharterSchema = Joi.object({
  titulo: Joi.string()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Título deve ter no mínimo 5 caracteres',
      'string.max': 'Título deve ter no máximo 200 caracteres',
    }),
  objetivo: Joi.string()
    .min(10)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'Objetivo deve ter no mínimo 10 caracteres',
      'string.max': 'Objetivo deve ter no máximo 1000 caracteres',
    }),
  escopo: Joi.string()
    .min(10)
    .max(1500)
    .optional()
    .messages({
      'string.min': 'Escopo deve ter no mínimo 10 caracteres',
      'string.max': 'Escopo deve ter no máximo 1500 caracteres',
    }),
  duracao: Joi.number()
    .integer()
    .min(30)
    .max(480)
    .optional()
    .messages({
      'number.min': 'Duração mínima é 30 minutos',
      'number.max': 'Duração máxima é 480 minutos',
    }),
  heuristicasIds: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .min(1)
    .max(20)
    .optional()
    .messages({
      'array.min': 'Pelo menos uma heurística deve ser selecionada',
      'array.max': 'Máximo 20 heurísticas por charter',
    }),
  ambienteTestado: Joi.string()
    .min(5)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Ambiente deve ter no mínimo 5 caracteres',
      'string.max': 'Ambiente deve ter no máximo 100 caracteres',
    }),
  versaoApp: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Versão deve ter no máximo 50 caracteres',
    }),
  observacoes: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Observações deve ter no máximo 1000 caracteres',
    }),
  status: Joi.string()
    .valid('planejado', 'em-execucao', 'finalizado', 'cancelado')
    .optional()
    .messages({
      'any.only': 'Status deve ser: planejado, em-execucao, finalizado ou cancelado',
    }),
}).min(1).strict();

/**
 * Search charter validation schema
 * @type {Joi.ObjectSchema}
 */
export const searchCharterSchema = Joi.object({
  search: Joi.string()
    .optional()
    .allow(''),
  /*search: Joi.string()
  x(100)
    .optional()
    .messages({
      'string.max': 'Termo de busca deve ter no máximo 100 caracteres',
    }),
  status: Joi.string()
    .valid('planejado', 'em-execucao', 'finalizado', 'cancelado')
    .optional()
    .messages({
      'any.only': 'Status inválido',
    }),*/
  status: Joi.string()
  .valid('planejado', 'em-execucao', 'finalizado', 'cancelado')
  .optional(),  
  limit: Joi.number()
  .integer()
  .min(1)
  .max(100)
  .default(20),  
  skip: Joi.number()
  .integer()
  .min(0)
  .default(0),  
  heuristicaId: Joi.string().optional()
});
