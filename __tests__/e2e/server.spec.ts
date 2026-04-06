import request from 'supertest';

import { Server } from '../../src/server/server';

const baseUrl = '/api/v1';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
});

afterAll(async () => {
  await server.stopServer();
});

describe('Health Check', () => {
  it('should return 200 if the server status is healthy', async () => {
    const response = await request(server.getApp()).get(`${baseUrl}/health`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'ok');
  });

  it('should return 400 if an invalid endpoint is accessed', async () => {
    const response = await request(server.getApp()).get(
      `${baseUrl}/nonexistent`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'You have an invalid endpoint'
    );
  });
});
