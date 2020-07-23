import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateUsersService from '../services/CreateUsesrService';

import User from '../models/User';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUsersService = new CreateUsersService();

  const user = await createUsersService.execute({
    name,
    email,
    password,
  });

  return response.json(user);
});

export default usersRouter;
