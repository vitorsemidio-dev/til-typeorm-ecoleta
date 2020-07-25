import { uuid } from 'uuidv4';
import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import CreateUsersService from './CreateUsersService';
import UpdateUsersService from './UpdateUsersService';

const connectionName = 'default';

let connection: Connection;

let createUsersService: CreateUsersService;
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

    createUsersService = new CreateUsersService();
    updateUsersService = new UpdateUsersService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update user', async () => {
    const user = await createUsersService.execute({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const userUpdated = await updateUsersService.execute({
      user_id: user.id,
      name: 'Remi',
      email: 'remi@sandstorm.com',
      password: '123456',
    });

    expect(userUpdated.id).toEqual(user.id);
    expect(userUpdated).toMatchObject({
      name: 'Remi',
      email: 'remi@sandstorm.com',
      password: '123456',
    });
  });

  it('should not be able to update email if it is already used by another user', async () => {
    await createUsersService.execute({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const { id } = await createUsersService.execute({
      name: 'Remi',
      email: 'remi@sandstorm.com',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        user_id: id,
        name: 'Remi',
        email: 'janedoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to update data from a non-existing user', async () => {
    const userId = uuid();

    await expect(
      updateUsersService.execute({
        user_id: userId,
        name: 'Non-existing user',
        email: 'non-existing-user@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
