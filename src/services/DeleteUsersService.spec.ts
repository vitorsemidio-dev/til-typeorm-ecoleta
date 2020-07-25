import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import DeleteUsersService from './DeleteUsersService';

const connectionName = 'default';

let connection: Connection;

let deleteUsersService: DeleteUsersService;

describe('Delete Users Service', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DROP FROM users');

    deleteUsersService = new DeleteUsersService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to delete an user', async () => {
    // TODO
  });

  it('should not be able to delete a non-existing user', async () => {
    // TODO
  });
});
