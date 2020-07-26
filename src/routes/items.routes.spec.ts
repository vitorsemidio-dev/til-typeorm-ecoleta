import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { uuid } from 'uuidv4';

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
  it('should be able to create a new item', async () => {
    const responseCreateItem = await request(app).post('/items').send({
      name: 'Item',
      price: 1,
    });

    expect(responseCreateItem.status).toBe(200);
    expect(responseCreateItem.body).toHaveProperty('id');
    expect(responseCreateItem.body).toMatchObject(
      expect.objectContaining({
        name: 'Item',
        price: 1,
      }),
    );
  });

  it('should not be able to create a new item with a negative price', async () => {
    // TEST RED: Create RN on service
    const responseCreateItem = await request(app).post('/items').send({
      name: 'Item',
      price: -1,
    });

    expect(responseCreateItem.status).toBe(400);

    expect(responseCreateItem.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  // Update item
  it('should be able to update an item', async () => {
    // TEST RED: await missing when call execute function
    const {
      body: { id },
    } = await request(app).post('/items').send({
      name: 'Item',
      price: 1,
    });

    const responseUpdateItem = await request(app).put(`/items/${id}`).send({
      name: 'Item update',
      price: 100,
    });

    expect(responseUpdateItem.status).toBe(200);
    expect(responseUpdateItem.body).toHaveProperty('id');

    expect(responseUpdateItem.body).toMatchObject({
      id,
      name: 'Item update',
      price: 100,
    });
  });

  it('should not be able to update a non-existing item', async () => {
    // TEST RED: await missing when call execute function
    const id = uuid();

    const responseUpdateItem = await request(app).put(`/items/${id}`).send({
      name: 'Item',
      price: 1,
    });

    expect(responseUpdateItem.status).toBe(400);
  });

  it('shoul not be able to update an item with a negative price', async () => {
    // TEST RED: missing validate negative price
    const {
      body: { id },
    } = await request(app).post('/items').send({
      name: 'Item',
      price: 1,
    });

    const responseUpdateItem = await request(app).put(`/items/${id}`).send({
      name: 'Item update',
      price: -1,
    });

    expect(responseUpdateItem.status).toBe(400);
  });

  // Delete item
  it('TEST EMPTY should be able to delete an item', async () => {
    //
  });

  it('TEST EMPTY should not be able to delete an item', async () => {
    //
  });
});
