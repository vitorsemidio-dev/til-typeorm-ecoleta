import request from 'supertest';
import { Connection, getConnection } from 'typeorm';

import app from '../app';
import createConnection from '../database';

const connectionName = 'test-connection';

let connection: Connection;

describe('Routes Test', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be list users', async () => {
    const {
      body: { id: idJane },
    } = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const {
      body: { id: idAlice },
    } = await request(app).post('/users').send({
      name: 'Alice Kruger',
      email: 'alicekruger@example.com',
      password: '123456',
    });

    const {
      body: { id: idRemi },
    } = await request(app).post('/users').send({
      name: 'Remi',
      email: 'remi@sandstorm.com',
      password: '123456',
    });

    const response = await request(app).get('/users');

    expect(response.body).toHaveLength(3);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Jane Doe',
          id: idJane,
        }),
        expect.objectContaining({
          name: 'Alice Kruger',
          id: idAlice,
        }),
        expect.objectContaining({
          name: 'Remi',
          id: idRemi,
        }),
      ]),
    );
  });
});
