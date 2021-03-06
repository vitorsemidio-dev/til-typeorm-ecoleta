import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import CreateUsersService from './CreateUsersService';

const connectionName = 'default';

let connection: Connection;

let createUsersService: CreateUsersService;

describe('Create Users Service', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');

    createUsersService = new CreateUsersService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new user', async () => {
    const user = await createUsersService.execute({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user).toMatchObject({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });
  });

  it('should not be able to create a new user with an email already registered', async () => {
    const { email } = await createUsersService.execute({
      name: 'Alice Kruger',
      email: 'janedoe@example.com',
      password: '123456',
    });

    await expect(
      createUsersService.execute({
        name: 'Jane Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
