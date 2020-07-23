import { Router } from 'express';
import { getRepository } from 'typeorm';

import DeleteUsersService from '../services/DeleteUsersService';
import CreateUsersService from '../services/CreateUsersService';

import User from '../models/User';

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

usersRouter.put('/', async (request, response) => {
  return response.json({ user: 'put' });
});

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const deleteUsersService = new DeleteUsersService();

    await deleteUsersService.execute(id);

    return response.status(204).json();
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

export default usersRouter;
