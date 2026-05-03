import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { store } from '../../src/models/in-memory.store.js';
import { v4 as uuidv4 } from 'uuid';

describe('Charter Controller', () => {
  let app;
  let authToken;
  let userId = 'user-123';
  let testHeuristicaId;
  let testCharterId;

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

    // Seed test heuristica
    testHeuristicaId = uuidv4();
    store.salvarHeuristica({
      id: testHeuristicaId,
      title: 'Test Heuristica',
      description: 'Test heuristica for charter',
      technique: 'Testing',
      criadoPor: userId,
      criadoEm: new Date().toISOString(),
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

  describe('POST /charters', () => {
    it('should create a new charter with valid data', async () => {
      const res = await request(app)
        .post('/charters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Test Charter',
          objetivo: 'Test objective for this charter',
          escopo: 'Test scope for testing the charter creation',
          duracao: 120,
          heuristicasIds: [testHeuristicaId],
          ambienteTestado: 'QA Environment',
          versaoApp: '1.0.0',
        })
        .expect(201);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('titulo', 'Test Charter');
      expect(res.body.data).to.have.property('status', 'planejado');
      
      testCharterId = res.body.data.id;
    });

    it('should reject with missing required fields', async () => {
      const res = await request(app)
        .post('/charters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Incomplete Charter',
          // Missing other required fields
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject with invalid heuristica ID', async () => {
      const res = await request(app)
        .post('/charters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Test Charter',
          objetivo: 'Test objective',
          escopo: 'Test scope for this charter',
          duracao: 120,
          heuristicasIds: ['non-existent-id'],
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .post('/charters')
        .send({
          titulo: 'Test Charter',
          objetivo: 'Test objective',
          escopo: 'Test scope for this charter',
          duracao: 120,
          heuristicasIds: [testHeuristicaId],
        })
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /charters/:id', () => {
    it('should get charter by ID', async () => {
      const res = await request(app)
        .get(`/charters/${testCharterId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('id', testCharterId);
    });

    it('should return 404 for non-existent charter', async () => {
      const res = await request(app)
        .get('/charters/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /charters', () => {
    it('should list all charters', async () => {
      const res = await request(app)
        .get('/charters')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.meta).to.have.property('total');
    });

    it('should apply status filter', async () => {
      const res = await request(app)
        .get('/charters?status=planejado')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should apply pagination', async () => {
      const res = await request(app)
        .get('/charters?limit=10&skip=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.meta.limit).to.equal(10);
    });
  });

  describe('PUT /charters/:id', () => {
    it('should update charter status', async () => {
      const res = await request(app)
        .put(`/charters/${testCharterId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'em-execucao',
        })
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data.status).to.equal('em-execucao');
    });

    it('should return 404 for non-existent charter', async () => {
      const res = await request(app)
        .put('/charters/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'finalizado',
        })
        .expect(404);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /charters/stats/estatisticas', () => {
    it('should get statistics', async () => {
      const res = await request(app)
        .get('/charters/stats/estatisticas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('totalCharters');
      expect(res.body.data).to.have.property('chartersPorStatus');
    });
  });

  describe('DELETE /charters/:id', () => {
    it('should delete charter', async () => {
      // Create a charter to delete
      const createRes = await request(app)
        .post('/charters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Charter to Delete',
          objetivo: 'This charter will be deleted',
          escopo: 'Delete test scope for this charter',
          duracao: 60,
          heuristicasIds: [testHeuristicaId],
        });

      const charterIdToDelete = createRes.body.data.id;

      const deleteRes = await request(app)
        .delete(`/charters/${charterIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deleteRes.body.success).to.equal(true);
    });

    it('should return 404 when deleting non-existent charter', async () => {
      const res = await request(app)
        .delete('/charters/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).to.equal(false);
    });
  });
});
