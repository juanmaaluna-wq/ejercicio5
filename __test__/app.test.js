const request = require('supertest');
const { app, resetContacts } = require('../src/app');

describe('API Contacts', () => {

  beforeEach(() => {
    resetContacts();
  });

  test('GET /api/contacts -> 200 y array', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/contacts -> crea contacto', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Juan',
        email: 'juan@test.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Juan');
  });

  test('POST /api/contacts -> 400 sin name', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({
        email: 'test@test.com'
      });

    expect(res.statusCode).toBe(400);
  });

  test('POST /api/contacts -> 400 email inválido', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Test',
        email: 'invalido'
      });

    expect(res.statusCode).toBe(400);
  });

  // 👇 USAMOS ID QUE YA EXISTE
  test('GET /api/contacts/:id -> devuelve contacto', async () => {
    const res = await request(app).get('/api/contacts/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('GET /api/contacts/:id -> 404', async () => {
    const res = await request(app).get('/api/contacts/999');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/contacts/:id -> actualiza', async () => {
    const res = await request(app)
      .put('/api/contacts/1')
      .send({ name: 'Actualizado' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Actualizado');
  });

  test('DELETE /api/contacts/:id -> elimina', async () => {
    const res = await request(app).delete('/api/contacts/1');
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/contacts/:id -> 404', async () => {
    const res = await request(app).delete('/api/contacts/999');
    expect(res.statusCode).toBe(404);
  });

});