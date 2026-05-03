import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { store } from '../../src/models/in-memory.store.js';

describe('Heuristicas Controller', () => {
  let app;
  let authToken;
  let userId = 'user-123';
  let testHeuristicaId;

  before(async () => {
    app = createApp();

    // Seed test user
    store.salvarUsuario({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'editor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Get auth token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginRes.body.data.token;
  });

  describe('POST /heuristicas', () => {
    it('should create a new heuristica with valid data', async () => {
      const res = await request(app)
        .post('/heuristicas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Heuristica',
          description: 'This is a test heuristica for testing purposes',
          technique: 'Exploratory Testing',
          applicationScenario: 'Mobile application testing scenario',
          examples: ['Example 1', 'Example 2'],
          tags: ['testing', 'exploration'],
        })
        .expect(201);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('title', 'Test Heuristica');
      expect(res.body.data).to.have.property('criadoPor', userId);
      
      testHeuristicaId = res.body.data.id;
    });

    it('should reject with missing required fields', async () => {
      const res = await request(app)
        .post('/heuristicas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Heuristica',
          // Missing description and technique
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject with title too short', async () => {
      const res = await request(app)
        .post('/heuristicas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'AB', // Too short
          description: 'This is a test heuristica',
          technique: 'Testing',
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .post('/heuristicas')
        .send({
          title: 'Test Heuristica',
          description: 'This is a test heuristica',
          technique: 'Testing',
        })
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /heuristicas/:id', () => {
    it('should get heuristica by ID', async () => {
      const res = await request(app)
        .get(`/heuristicas/${testHeuristicaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('id', testHeuristicaId);
      expect(res.body.data).to.have.property('title');
    });

    it('should return 404 for non-existent heuristica', async () => {
      const res = await request(app)
        .get('/heuristicas/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).to.equal(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .get(`/heuristicas/${testHeuristicaId}`)
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /heuristicas', () => {
    it('should list all heuristicas', async () => {
      const res = await request(app)
        .get('/heuristicas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      
      console.log('JSON RECEBIDO:', JSON.stringify(res.body, null, 2)); // Adicione isso  
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.meta).to.have.property('total');
      expect(res.body.meta).to.have.property('limit');
      expect(res.body.meta).to.have.property('skip');
    });

    it('should apply search filter', async () => {
      const res = await request(app)
        .get('/heuristicas?search=Test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should apply status filter', async () => {
      const res = await request(app)
        .get('/heuristicas?status=draft')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should apply pagination', async () => {
      const res = await request(app)
        .get('/heuristicas?limit=10&skip=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.meta.limit).to.equal(10);
      expect(res.body.meta.skip).to.equal(0);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .get('/heuristicas')
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('PUT /heuristicas/:id', () => {
    it('should update heuristica with valid data', async () => {
      const res = await request(app)
        .put(`/heuristicas/${testHeuristicaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Heuristica',
          description: 'Updated description for the test heuristica',
        })
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('title', 'Updated Test Heuristica');
      expect(res.body.data).to.have.property('atualizadoEm');
    });

    it('should reject update with invalid data', async () => {
      const res = await request(app)
        .put(`/heuristicas/${testHeuristicaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'AB', // Too short
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should return 404 for non-existent heuristica', async () => {
      const res = await request(app)
        .put('/heuristicas/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
        })
        .expect(404);

      expect(res.body.success).to.equal(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .put(`/heuristicas/${testHeuristicaId}`)
        .send({
          title: 'Updated Title',
        })
        .expect(401);

      expect(res.body.success).to.equal(false);
    });

    it('should reject when no fields to update', async () => {
      const res = await request(app)
        .put(`/heuristicas/${testHeuristicaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /heuristicas/busca/:termo', () => {
    it('should search heuristicas by term', async () => {
      const res = await request(app)
        .get('/heuristicas/busca/Test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.meta).to.have.property('searchTerm');
    });

    it('should return empty array for no matches', async () => {
      const res = await request(app)
        .get('/heuristicas/busca/XyZaBcDeF')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .get('/heuristicas/busca/Test')
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /heuristicas/stats/estatisticas', () => {
    it('should get statistics', async () => {
      const res = await request(app)
        .get('/heuristicas/stats/estatisticas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('totalHeuristicas');
      expect(res.body.data).to.have.property('heuristicasPorStatus');
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .get('/heuristicas/stats/estatisticas')
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('DELETE /heuristicas/:id', () => {
    let heuristicaToDelete;

    before(async () => {
      // Create a heuristica to delete
      const res = await request(app)
        .post('/heuristicas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Heuristica to Delete',
          description: 'This heuristica will be deleted in tests',
          technique: 'Testing',
        });

      heuristicaToDelete = res.body.data.id;
    });

    it('should delete heuristica', async () => {
      const res = await request(app)
        .delete(`/heuristicas/${heuristicaToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('message');
    });

    it('should return 404 when deleting non-existent heuristica', async () => {
      const res = await request(app)
        .delete('/heuristicas/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).to.equal(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .delete(`/heuristicas/${testHeuristicaId}`)
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });
});
