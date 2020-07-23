import { Router } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();

  return response.json(users);
});

export default usersRouter;
