import { Connection, getConnection } from 'typeorm';

import UpdateUsersService from './UpdateUsersService';

const connectionName = 'default';

let connection: Connection;

let updateUsersService: UpdateUsersService;

describe('Update Users Service', () => {
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
