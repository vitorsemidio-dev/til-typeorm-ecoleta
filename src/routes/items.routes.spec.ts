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

  // List items
  it('should be able to items', async () => {
    const {
      body: { id: idItemA },
    } = await request(app).post('/items').send({
      name: 'Item A',
      price: 10,
    });

    const {
      body: { id: idItemB },
    } = await request(app).post('/items').send({
      name: 'Item B',
      price: 20,
    });

    const {
      body: { id: idItemC },
    } = await request(app).post('/items').send({
      name: 'Item C',
      price: 30,
    });

    const response = await request(app).get('/items');

    expect(response.body).toHaveLength(3);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Item A',
          id: idItemA,
        }),
        expect.objectContaining({
          name: 'Item B',
          id: idItemB,
        }),
        expect.objectContaining({
          name: 'Item C',
          id: idItemC,
        }),
      ]),
    );
  });

  // Create item
  it('TEST EMPTY should be able to create a new item', async () => {
    //
  });

  it('TEST EMPTY should not be able to create a new item with a negative price', async () => {
    //
  });

  // Update item
  it('TEST EMPTY should be able to update an item', async () => {
    //
  });

  it('TEST EMPTY should not be able to update a non-existing item', async () => {
    //
  });

  it('TEST EMPTY shoul not be able to update an item with a negative price', async () => {
    //
  });

  // Delete item
  it('TEST EMPTY should be able to delete an item', async () => {
    //
  });

  it('TEST EMPTY should not be able to delete an item', async () => {
    //
  });
});
