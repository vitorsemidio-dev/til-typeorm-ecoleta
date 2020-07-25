import { Connection, getConnection, getRepository } from 'typeorm';

import createConnection from '../database';

import Item from '../models/Item';

let connection: Connection;

describe('Create Item', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM items');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new item', async () => {
    const itemsRepository = getRepository(Item, 'test-connection');

    const item = itemsRepository.create({
      name: 'Item do Test',
      price: 1,
    });

    await itemsRepository.save(item);

    expect(item).toHaveProperty('id');
    expect(item.name).toEqual('Item do Test');
  });
});
