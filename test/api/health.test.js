import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Health Controller', () => {
  let app;

  before(() => {
    app = createApp();
  });

  describe('GET /health', () => {
    it('should return 200 OK with health status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('status', 'UP');
      expect(res.body.data).to.have.property('service', 'heurify-backend');
      expect(res.body.data).to.have.property('timestamp');
      expect(res.body.data).to.have.property('uptime');
      expect(res.body.data).to.have.property('memory');
      expect(res.body.data).to.have.property('environment');
    });

    it('should have valid timestamp format', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      const timestamp = new Date(res.body.data.timestamp);
      expect(timestamp).to.be.instanceof(Date);
      expect(timestamp.getTime()).to.be.greaterThan(0);
    });

    it('should have positive uptime', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body.data.uptime).to.be.greaterThan(0);
    });

    it('should return memory usage information', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body.data.memory).to.have.property('rss');
      expect(res.body.data.memory).to.have.property('heapTotal');
      expect(res.body.data.memory).to.have.property('heapUsed');
    });
  });

  describe('API Response Format', () => {
    it('should return consistent response structure', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).to.have.property('success');
      expect(res.body).to.have.property('data');
      expect(res.body).to.have.property('meta');
      expect(res.body.meta).to.have.property('timestamp');
    });
  });

  describe('Content-Type Headers', () => {
    it('should return JSON content type', async () => {
      await request(app)
        .get('/health')
        .expect('Content-Type', /json/);
    });
  });
});
