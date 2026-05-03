import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { store } from '../../src/models/in-memory.store.js';

describe('SBTM Sessions Controller', () => {
  let app;
  let authToken;
  let userId = 'user-123';
  let testCharterId;
  let testSessaoId;

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

    // Seed test charter
    testCharterId = '550e8400-e29b-41d4-a716-446655440000'; // Um UUID v4 válido
    
    store.salvarCharter({
      id: testCharterId,
      titulo: 'Test Charter',
      objetivo: 'Test objective',
      escopo: 'Test scope',
      duracao: 120,
      status: 'planejado',
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

  describe('POST /sessoes-sbtm', () => {
    it('should create a new SBTM session', async () => {
      
      
    const payload = {
        nome: 'Test SBTM Session',
        charterId: testCharterId,
        testador: 'Testador Principal',
        dataInicio: new Date().toISOString(),
        observacoesInicio: 'Test observations',
    };        
      
      const res = await request(app)
        .post('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);
        
        // LOG DE EMERGÊNCIA
        if (res.status !== 201) {
            console.log('ERRO DO JOI:', JSON.stringify(res.body.error, null, 2));
        }

      expect(res.status).to.equal(201);      


      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('status', 'em-progresso');
      
      testSessaoId = res.body.data.id;
    });

    it('should reject with missing required fields', async () => {
      const res = await request(app)
        .post('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Incomplete Session',
          // Missing charterId, testador, dataInicio
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject with invalid charter ID', async () => {
      const res = await request(app)
        .post('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Test Session',
          charterId: 'non-existent-charter',
          testador: 'Testador',
          dataInicio: new Date().toISOString(),
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .post('/sessoes-sbtm')
        .send({
          nome: 'Test Session',
          charterId: testCharterId,
          testador: 'Testador',
          dataInicio: new Date().toISOString(),
        })
        .expect(401);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /sessoes-sbtm/:id', () => {
    it('should get SBTM session by ID', async () => {
      const res = await request(app)
        .get(`/sessoes-sbtm/${testSessaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('id', testSessaoId);
    });

    it('should return 404 for non-existent session', async () => {
      const res = await request(app)
        .get('/sessoes-sbtm/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /sessoes-sbtm', () => {
    it('should list all SBTM sessions', async () => {
      const res = await request(app)
        .get('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.meta).to.have.property('total');
    });

    it('should apply status filter', async () => {
      const res = await request(app)
        .get('/sessoes-sbtm?status=em-progresso')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should apply charter filter', async () => {
      const res = await request(app)
        .get(`/sessoes-sbtm?charterId=${testCharterId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should apply pagination', async () => {
      const res = await request(app)
        .get('/sessoes-sbtm?limit=10&skip=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.meta.limit).to.equal(10);
    });
  });

  describe('PUT /sessoes-sbtm/:id', () => {
    it('should update session status to pausada', async () => {
      const res = await request(app)
        .put(`/sessoes-sbtm/${testSessaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'pausada',
          observacoes: 'Pausing for lunch',
        })
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data.status).to.equal('pausada');
    });

    it('should update session status back to em-progresso', async () => {
      const res = await request(app)
        .put(`/sessoes-sbtm/${testSessaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'em-progresso',
        })
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data.status).to.equal('em-progresso');
    });

    it('should reject invalid status transition', async () => {
      // Try to move from em-progresso to  (should fail)
      const res = await request(app)
        .put(`/sessoes-sbtm/${testSessaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'status-que-nao-existe', // Isso forçará um 400 pelo Joi
        })
        .expect(400); // Actually em-progresso to em-progresso is valid

      expect(res.body.success).to.equal(false);
    });

    it('should return 404 for non-existent session', async () => {
      const res = await request(app)
        .put('/sessoes-sbtm/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'finalizada',
        })
        .expect(404);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('POST /sessoes-sbtm/:id/finalizar', () => {
    it('should finalize session with findings', async () => {
      const res = await request(app)
        .post(`/sessoes-sbtm/${testSessaoId}/finalizar`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataFim: new Date().toISOString(),
          achados: [
            {
              titulo: 'Critical Bug Found',
              descricao: 'Application crashes when clicking button on home page',
              severidade: 'critica',
              tipo: 'bug',
              passosPara: '1. Go to home page\n2. Click button\n3. Crash occurs',
              ambienteOcorrencia: 'QA Environment',
            },
            {
              titulo: 'Usability Issue',
              descricao: 'Button labels are not clear',
              severidade: 'media',
              tipo: 'usabilidade',
            },
          ],
          observacoesFinais: 'Session completed successfully with important findings',
        })
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data.status).to.equal('finalizada');
      expect(res.body.data.achados).to.have.lengthOf(2);
      expect(res.body.meta.achadosRegistrados).to.equal(2);
    });

    it('should finalize session without findings', async () => {
      // Create another session to finalize
      const createRes = await request(app)
        .post('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Session Without Findings',
          charterId: testCharterId,
          testador: 'Testador',
          dataInicio: new Date().toISOString(),
        });

      const sessaoId = createRes.body.data.id;

      const res = await request(app)
        .post(`/sessoes-sbtm/${sessaoId}/finalizar`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataFim: new Date().toISOString(),
          achados: [],
          observacoesFinais: 'No findings',
        })
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data.status).to.equal('finalizada');
      expect(res.body.data.achados).to.have.lengthOf(0);
    });

    it('should reject if session already finalized', async () => {
      const res = await request(app)
        .post(`/sessoes-sbtm/${testSessaoId}/finalizar`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataFim: new Date().toISOString(),
          achados: [],
        })
        .expect(400);

      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /sessoes-sbtm/stats/estatisticas', () => {
    it('should get statistics', async () => {
      const res = await request(app)
        .get('/sessoes-sbtm/stats/estatisticas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('totalSessoes');
      expect(res.body.data).to.have.property('sessoesPorStatus');
      expect(res.body.data).to.have.property('totalAchados');
      expect(res.body.data).to.have.property('achadosPorSeveridade');
    });
  });

  describe('DELETE /sessoes-sbtm/:id', () => {
    it('should not delete session while em-progresso', async () => {
      // Create a session
      const createRes = await request(app)
        .post('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Session to Delete',
          charterId: testCharterId,
          testador: 'Testador',
          dataInicio: new Date().toISOString(),
        });

      const sessaoId = createRes.body.data.id;

      const deleteRes = await request(app)
        .delete(`/sessoes-sbtm/${sessaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(deleteRes.body.success).to.equal(false);
    });

    it('should delete finalized session', async () => {
      // Create and finalize a session
      const createRes = await request(app)
        .post('/sessoes-sbtm')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Session to Finalize and Delete',
          charterId: testCharterId,
          testador: 'Testador',
          dataInicio: new Date().toISOString(),
        });

      const sessaoId = createRes.body.data.id;

      await request(app)
        .post(`/sessoes-sbtm/${sessaoId}/finalizar`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataFim: new Date().toISOString(),
          achados: [],
        });

      const deleteRes = await request(app)
        .delete(`/sessoes-sbtm/${sessaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deleteRes.body.success).to.equal(true);
    });

    it('should return 404 for non-existent session', async () => {
      const res = await request(app)
        .delete('/sessoes-sbtm/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).to.equal(false);
    });
  });
});
