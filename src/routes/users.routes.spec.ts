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
    const responseCreateUser = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    expect(responseCreateUser.body).toHaveProperty('id');

    const { id } = responseCreateUser.body;

    const responseUpdateUser = await request(app).put(`/users/${id}`).send({
      name: 'Remi',
      email: 'remi@example',
      password: '654321',
    });

    expect(responseUpdateUser.body).toHaveProperty('id');
    expect(responseUpdateUser.body.id).toEqual(responseCreateUser.body.id);
    expect(responseUpdateUser.body).toMatchObject({
      name: 'Remi',
      email: 'remi@example',
      password: '654321',
    });
  });

  it('should be able to update each data from user', async () => {
    const {
      body: { id },
    } = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const responseUpdateName = await request(app).put(`/users/${id}`).send({
      name: 'Remi',
    });

    expect(responseUpdateName.status).toBe(200);
    expect(responseUpdateName.body).toMatchObject({
      id,
      name: 'Remi',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const responseUpdateEmail = await request(app).put(`/users/${id}`).send({
      email: 'remi@sandstorm.com',
    });

    expect(responseUpdateEmail.status).toBe(200);
    expect(responseUpdateEmail.body).toMatchObject({
      id,
      name: 'Remi',
      email: 'remi@sandstorm.com',
      password: '123456',
    });

    const responseUpdatePassword = await request(app).put(`/users/${id}`).send({
      password: '654321',
    });

    expect(responseUpdatePassword.status).toBe(200);
    expect(responseUpdatePassword.body).toMatchObject({
      id,
      name: 'Remi',
      email: 'remi@sandstorm.com',
      password: '654321',
    });
  });

  it('should not be able to update e-mail to another one that is already used', async () => {
    await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const responseUser = await request(app).post('/users').send({
      name: 'Remi',
      email: 'janedoe@example.com',
      password: '123456',
    });

    expect(responseUser.status).toBe(400);
    expect(responseUser.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it('should not be able to update a non-existing user', async () => {
    const id = uuid();
    const response = await request(app).put(`/users/${id}`).send({
      name: 'Jane Doe',
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

  // Delete user
  it('should be able to delete an user', async () => {
    const {
      body: { id },
    } = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const responseDeleteUser = await request(app).delete(`/users/${id}`);

    expect(responseDeleteUser.status).toBe(204);
  });

  it('should not be able to delete a non-existing user', async () => {
    const id = uuid();
    const responseDeleteUser = await request(app).delete(`/users/${id}`);

    expect(responseDeleteUser.status).toBe(400);
    expect(responseDeleteUser.body).toMatchObject(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });
});
