import Joi from 'joi';

/**
 * Create SBTM session validation schema
 * @type {Joi.ObjectSchema}
 */
export const createSessaoSbtmSchema = Joi.object({
  nome: Joi.string()
    .min(5)
    .max(150)
    .required()
    .messages({
      'string.min': 'Nome da sessão deve ter no mínimo 5 caracteres',
      'string.max': 'Nome da sessão deve ter no máximo 150 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  charterId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'any.required': 'ID do charter é obrigatório',
      'string.guid': 'ID do charter deve ser um UUID válido',
    }),
  testador: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome do testador deve ter no mínimo 3 caracteres',
      'string.max': 'Nome do testador deve ter no máximo 100 caracteres',
      'any.required': 'Nome do testador é obrigatório',
    }),
  dataInicio: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'Data de início deve estar em formato ISO 8601',
      'any.required': 'Data de início é obrigatória',
    }),
  observacoesInicio: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Observações deve ter no máximo 500 caracteres',
    }),
})

/**
 * Update SBTM session status schema
 * @type {Joi.ObjectSchema}
 */
export const updateSessaoSbtmSchema = Joi.object({
  status: Joi.string()
    .valid('em-progresso', 'pausada', 'finalizada')
    .optional()
    .messages({
      'any.only': 'Status deve ser: em-progresso, pausada ou finalizada',
    }),
  observacoes: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Observações deve ter no máximo 500 caracteres',
    }),
}).strict();

/**
 * Complete SBTM session schema (registro de achados)
 * @type {Joi.ObjectSchema}
 */
export const completarSessaoSbtmSchema = Joi.object({
  achados: Joi.array()
    .items(
      Joi.object({
        titulo: Joi.string()
          .min(5)
          .max(200)
          .required()
          .messages({
            'string.min': 'Título do achado deve ter no mínimo 5 caracteres',
            'string.max': 'Título do achado deve ter no máximo 200 caracteres',
            'any.required': 'Título é obrigatório',
          }),
        descricao: Joi.string()
          .min(10)
          .max(2000)
          .required()
          .messages({
            'string.min': 'Descrição deve ter no mínimo 10 caracteres',
            'string.max': 'Descrição deve ter no máximo 2000 caracteres',
            'any.required': 'Descrição é obrigatória',
          }),
        severidade: Joi.string()
          .valid('critica', 'alta', 'media', 'baixa')
          .required()
          .messages({
            'any.only': 'Severidade deve ser: critica, alta, media ou baixa',
            'any.required': 'Severidade é obrigatória',
          }),
        tipo: Joi.string()
          .valid('bug', 'usabilidade', 'performance', 'seguranca', 'outro')
          .required()
          .messages({
            'any.only': 'Tipo deve ser: bug, usabilidade, performance, seguranca ou outro',
            'any.required': 'Tipo é obrigatório',
          }),
        passosPara: Joi.string()
          .max(1000)
          .optional()
          .messages({
            'string.max': 'Passos deve ter no máximo 1000 caracteres',
          }),
        ambienteOcorrencia: Joi.string()
          .max(200)
          .optional()
          .messages({
            'string.max': 'Ambiente deve ter no máximo 200 caracteres',
          }),
      })
    )
    .min(0)
    .max(50)
    .optional()
    .messages({
      'array.max': 'Máximo 50 achados por sessão',
    }),
  observacoesFinais: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Observações deve ter no máximo 1000 caracteres',
    }),
  dataFim: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'Data de fim deve estar em formato ISO 8601',
      'any.required': 'Data de fim é obrigatória',
    }),
})

/**
 * Search SBTM sessions schema
 * @type {Joi.ObjectSchema}
 */
export const searchSessaoSbtmSchema = Joi.object({
  search: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Termo de busca deve ter no máximo 100 caracteres',
    }),
  status: Joi.string()
    .valid('em-progresso', 'pausada', 'finalizada')
    .optional()
    .messages({
      'any.only': 'Status inválido',
    }),
  charterId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.guid': 'ID do charter deve ser um UUID válido',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit deve ser no mínimo 1',
      'number.max': 'Limit deve ser no máximo 100',
    }),
  skip: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Skip não pode ser negativo',
    }),
})
