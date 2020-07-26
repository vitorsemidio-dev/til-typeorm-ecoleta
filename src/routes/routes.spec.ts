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

  // List users
  it('should be able to list users', async () => {
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

  // Create User
  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });
  });

  it('should not be able to create a new user with a e-mail already registred', async () => {
    await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const response = await request(app).post('/users').send({
      name: 'Remi',
      email: 'janedoe@example.com',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new user with an invalid e-mail', async () => {
    // TEST RED:
    const response = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'invalida-email',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new user without some information (name, email, password)', async () => {
    // TEST GREEN: null value violates not-null constraint
    const responseWithoutName = await request(app).post('/users').send({
      email: 'withoutname@example.com',
      password: '123456',
    });

    const responseWithoutEmail = await request(app).post('/users').send({
      name: 'Jane Doe',
      password: '123456',
    });

    const responseWithoutPassword = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'withoutpassword@example.com',
    });

    expect(responseWithoutName.status).toBe(400);
    expect(responseWithoutEmail.status).toBe(400);
    expect(responseWithoutPassword.status).toBe(400);

    expect(responseWithoutName.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );

    expect(responseWithoutEmail.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );

    expect(responseWithoutPassword.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  // Update User
  it('should be able to update all user information', async () => {
    // TEST EMPTY
  });

  it('should be able to update each data from user', async () => {
    // TEST EMPTY
  });

  it('should not be able to update e-mail to another one that is already used', async () => {
    // TEST EMPTY
  });

  it('should not be able to update a non-existing user', async () => {
    // TEST EMPTY
  });

  // Delete user
  it('should be able to delete an user', () => {
    // TEST EMPTY
  });

  it('should not be able to delete a non-existing user', async () => {
    // TEST EMPTY
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
    // TEST EMPTY
  });

  it('should not be able to create a new item with a negative price', async () => {
    // TEST EMPTY
  });

  // Update item
  it('should be able to update an item', async () => {
    // TEST EMPTY
  });

  it('should not be able to update a non-existing item', async () => {
    // TEST EMPTY
  });

  it('shoul not be able to update an item with a negative price', async () => {
    // TEST EMPTY
  });

  // Delete item
  it('should be able to delete an item', async () => {
    // TEST EMPTY
  });

  it('should not be able to delete an item', async () => {
    // TEST EMPTY
  });
});
