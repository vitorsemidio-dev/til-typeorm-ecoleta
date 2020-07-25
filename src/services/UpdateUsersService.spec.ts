import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import UpdateUsersService from './UpdateUsersService';

const connectionName = 'default';

let connection: Connection;

let updateUsersService: UpdateUsersService;

describe('Update Users Service', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');

    updateUsersService = new UpdateUsersService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update user', async () => {
    // TODO
  });

  it('should not be able to update email if it is already used by another user', async () => {
    // TODO
  });

  it('should not be able to update data from a non-existing user', async () => {
    // TODO
  });
});
