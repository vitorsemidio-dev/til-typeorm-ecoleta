import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import UpdateItemsService from './UpdateItemsService';

const connectionName = 'default';

let connection: Connection;

let updateItemsService: UpdateItemsService;

describe('Update Items Service', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROPS TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    // TODO
  });

  afterAll(async () => {
    // TODO
  });

  it('should be able to update an item', async () => {
    // TODO
  });

  it('should not be able to update a non-existing item', async () => {
    // TODO
  });

  it('should not be able to update an item with a negative price', async () => {
    // TODO
  });
});
