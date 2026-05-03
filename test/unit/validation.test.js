import { expect } from 'chai';
import { createValidator, createQueryValidator } from '../../src/middleware/validation.middleware.js';
import Joi from 'joi';

describe('Validation Middleware', () => {
  describe('createValidator', () => {
    it('should pass valid data through', (done) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: () => res,
        json: () => res,
      };

      const next = () => {
        expect(req.validatedBody).to.deep.equal(req.body);
        done();
      };

      const middleware = createValidator(schema);
      middleware(req, res, next);
    });

    it('should reject invalid email', (done) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const req = {
        body: {
          email: 'invalid-email',
          password: 'password123',
        },
      };

      let statusCode;
      let jsonData;

      const res = {
        status: (code) => {
          statusCode = code;
          return res;
        },
        json: (data) => {
          jsonData = data;
          expect(statusCode).to.equal(400);
          expect(jsonData.error.code).to.equal('VALIDATION_ERROR');
          expect(jsonData.error.details).to.be.an('array');
          done();
        },
      };

      const next = () => {};

      const middleware = createValidator(schema);
      middleware(req, res, next);
    });

    it('should reject when required field is missing', (done) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const req = {
        body: {
          email: 'test@example.com',
        },
      };

      let statusCode;
      let jsonData;

      const res = {
        status: (code) => {
          statusCode = code;
          return res;
        },
        json: (data) => {
          jsonData = data;
          expect(statusCode).to.equal(400);
          expect(jsonData.error.code).to.equal('VALIDATION_ERROR');
          done();
        },
      };

      const next = () => {};

      const middleware = createValidator(schema);
      middleware(req, res, next);
    });

    it('should strip unknown fields', (done) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });

      const req = {
        body: {
          email: 'test@example.com',
          unknownField: 'should-be-removed',
        },
      };

      const res = {
        status: () => res,
        json: () => res,
      };

      const next = () => {
        expect(req.validatedBody).to.not.have.property('unknownField');
        expect(req.validatedBody).to.have.property('email');
        done();
      };

      const middleware = createValidator(schema);
      middleware(req, res, next);
    });
  });

  describe('createQueryValidator', () => {
    it('should validate query parameters', (done) => {
      const schema = Joi.object({
        search: Joi.string().optional(),
        limit: Joi.number().optional(),
      });

      const req = {
        query: {
          search: 'test',
          limit: '10',
        },
      };

      const res = {
        status: () => res,
        json: () => res,
      };

      const next = () => {
        expect(req.validatedQuery).to.deep.equal({
          search: 'test',
          limit: 10, // Joi converts string to number
        });
        done();
      };

      const middleware = createQueryValidator(schema);
      middleware(req, res, next);
    });
  });
});
