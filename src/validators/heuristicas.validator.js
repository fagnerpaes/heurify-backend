import Joi from 'joi';

/**
 * Create heuristica validation schema
 * @type {Joi.ObjectSchema}
 */
export const createHeuristicaSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Título deve ter no mínimo 3 caracteres',
      'string.max': 'Título deve ter no máximo 200 caracteres',
      'any.required': 'Título é obrigatório',
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Descrição deve ter no mínimo 10 caracteres',
      'string.max': 'Descrição deve ter no máximo 2000 caracteres',
      'any.required': 'Descrição é obrigatória',
    }),
  technique: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Técnica deve ter no mínimo 3 caracteres',
      'string.max': 'Técnica deve ter no máximo 100 caracteres',
      'any.required': 'Técnica é obrigatória',
    }),
  applicationScenario: Joi.string()
    .min(10)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'Cenário de aplicação deve ter no mínimo 10 caracteres',
      'string.max': 'Cenário de aplicação deve ter no máximo 1000 caracteres',
    }),
  examples: Joi.array()
    .items(Joi.string().min(5).max(500))
    .optional()
    .messages({
      'array.base': 'Exemplos deve ser um array',
    }),
  riskNotes: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Observações de risco deve ter no máximo 1000 caracteres',
    }),
  tags: Joi.array()
    .items(Joi.string().min(2).max(50))
    .optional()
    .max(10)
    .messages({
      'array.base': 'Tags deve ser um array',
      'array.max': 'Máximo de 10 tags permitidas',
    }),
  status: Joi.string()
    .valid('draft', 'reviewed', 'approved', 'archived')
    .optional()
    .default('draft')
    .messages({
      'string.valid': 'Status deve ser draft, reviewed, approved ou archived',
    }),
});

/**
 * Update heuristica validation schema (all fields optional)
 * @type {Joi.ObjectSchema}
 */
export const updateHeuristicaSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .optional(),
  description: Joi.string()
    .min(10)
    .max(2000)
    .optional(),
  technique: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  applicationScenario: Joi.string()
    .min(10)
    .max(1000)
    .optional(),
  examples: Joi.array()
    .items(Joi.string().min(5).max(500))
    .optional()
    .max(20),
  riskNotes: Joi.string()
    .max(1000)
    .optional(),
  tags: Joi.array()
    .items(Joi.string().min(2).max(50))
    .optional()
    .max(10),
  status: Joi.string()
    .valid('draft', 'reviewed', 'approved', 'archived')
    .optional(),
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser fornecido para atualizar',
});

/**
 * Search/Filter query validation schema
 * @type {Joi.ObjectSchema}
 */
export const searchHeuristicaSchema = Joi.object({
  search: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Termo de busca deve ter no máximo 100 caracteres',
    }),
  technique: Joi.string()
    .max(100)
    .optional(),
  status: Joi.string()
    .valid('draft', 'reviewed', 'approved', 'archived')
    .optional(),
  tags: Joi.array()
    .items(Joi.string())
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional(),
  skip: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional(),
});
