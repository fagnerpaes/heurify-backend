import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { store } from '../../src/models/in-memory.store.js';
import { ERROR_CODES } from '../../src/config/error-codes.js';

describe('Auth Controller', () => {
  let app;

  before(() => {
    app = createApp();

    // Seed user for login tests
    store.salvarUsuario({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'editor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  afterEach(() => {
    // Clear new users created during tests (keep seeded user)
    // In production, use proper database truncation
  });

  describe('POST /auth/login', () => {
    it('should login user with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('user');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user).to.have.property('email', 'test@example.com');
      expect(res.body.data.token).to.be.a('string');
    });

    it('should reject login with invalid email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(res.body.success).to.equal(false);
      expect(res.body.error).to.have.property('code', 'AUTH_001');
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(res.body.success).to.equal(false);
      expect(res.body.error).to.have.property('code', 'AUTH_001');
    });

    it('should reject login with invalid email format', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        })
        //console.log('CORPO DA RESPOSTA:', res.body); // Adicione isso aqui
        .expect(400);
        expect(res.status).to.equal(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject login with short password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('POST /auth/register', () => {
    it('should register new user with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
        .expect(201);

      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('user');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user).to.have.property('email', 'newuser@example.com');
      expect(res.body.data.user).to.have.property('name', 'New User');
    });

    it('should reject register with existing email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Another User',
          email: 'test@example.com', // Already exists
          password: 'password123',
          confirmPassword: 'password123',
        })
        .expect(409);

      expect(res.body.success).to.equal(false);
      expect(res.body.error).to.have.property('code', ERROR_CODES.CONFLICT);
    });

    it('should reject register with mismatched passwords', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'New User',
          email: 'another@example.com',
          password: 'password123',
          confirmPassword: 'password456',
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject register with short name', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'AB', // Too short
          email: 'test2@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject register with invalid email format', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'New User',
          email: 'not-an-email',
          password: 'password123',
          confirmPassword: 'password123',
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should return JWT token with correct payload', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Token Test User',
          email: 'tokentest@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
        .expect(201);

      const token = res.body.data.token;
      expect(token).to.be.a('string');
      // Token format validation (basic JWT structure: header.payload.signature)
      const tokenParts = token.split('.');
      expect(tokenParts).to.have.lengthOf(3);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user when authenticated', async () => {
      // First login to get token
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      const token = loginRes.body.data.token;

      // Then get current user
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data.user).to.have.property('id', 'user-123');
      expect(res.body.data.user).to.have.property('email', 'test@example.com');
      expect(res.body.data.user).to.have.property('role', 'editor');
    });

    it('should reject without authentication token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(res.body.success).to.equal(false);
    });

    it('should reject with invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout authenticated user', async () => {
      // First login to get token
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      const token = loginRes.body.data.token;

      // Then logout
      const res = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('message');
    });

    it('should reject logout without token', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });
});
