import { uuid } from 'uuidv4';
import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import CreateUsersService from './CreateUsersService';
import DeleteUsersService from './DeleteUsersService';

const connectionName = 'default';

let connection: Connection;

let createUsersService: CreateUsersService;
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
    await connection.query('DELETE FROM users');

    createUsersService = new CreateUsersService();
    deleteUsersService = new DeleteUsersService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to delete an user', async () => {
    const { id } = await createUsersService.execute({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    await deleteUsersService.execute(id);
  });

  it('should not be able to delete a non-existing user', async () => {
    const userId = uuid();

    await expect(deleteUsersService.execute(userId)).rejects.toBeInstanceOf(
      Error,
    );
  });
});
