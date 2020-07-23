import { Router } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

import CreateUsersService from '../services/CreateUsersService';
import DeleteUsersService from '../services/DeleteUsersService';
import UpdateUsersService from '../services/UpdateUsersService';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  try {
    const createUsersService = new CreateUsersService();

    const user = await createUsersService.execute({
      name,
      email,
      password,
    });

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

usersRouter.put('/:user_id', async (request, response) => {
  const { user_id } = request.params;
  const { name, email, password } = request.body;
  try {
    const updateUsersService = new UpdateUsersService();

    const userUpdated = await updateUsersService.execute({
      user_id,
      name,
      email,
      password,
    });

    return response.json(userUpdated);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

usersRouter.delete('/:user_id', async (request, response) => {
  const { user_id } = request.params;
  try {
    const deleteUsersService = new DeleteUsersService();

    await deleteUsersService.execute(user_id);

    return response.status(204).json();
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

export default usersRouter;
