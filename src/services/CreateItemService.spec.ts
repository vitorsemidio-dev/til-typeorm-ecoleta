import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';
import CreateItemsService from './CreateItemsService';

// TODO: Descobrir como automatizar nome da conexão para os testes
const connectionName = 'default';

let connection: Connection;

let createItemsService: CreateItemsService;

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

    createItemsService = new CreateItemsService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new item', async () => {
    const item = await createItemsService.execute({
      name: 'Item do Test',
      price: 1,
    });

    expect(item).toHaveProperty('id');
    expect(item.name).toEqual('Item do Test');
    expect(item.price).toEqual(1);
  });
});
