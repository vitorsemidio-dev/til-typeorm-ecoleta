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
    // TODO
  });

  afterAll(async () => {
    // TODO
  });

  it('should be able to create a new user', async () => {
    // TODO
  });

  it('should not be able to create a new user with an email already registered', async () => {
    // TODO
  });
});
