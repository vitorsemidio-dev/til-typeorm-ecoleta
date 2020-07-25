import { Connection, getConnection, getRepository } from 'typeorm';

import createConnection from '../database';

import Item from '../models/Item';

const connectionName = 'test-connection';

let connection: Connection;

describe('Create Item', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

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
    const itemsRepository = getRepository(Item, connectionName);

    const item = itemsRepository.create({
      name: 'Item do Test',
      price: 1,
    });

    await itemsRepository.save(item);

    expect(item).toHaveProperty('id');
    expect(item.name).toEqual('Item do Test');
    expect(item.price).toEqual(1);
  });
});
