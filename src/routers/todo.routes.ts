import { Router } from 'express';
import * as todo from '../controllers/todo.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema';

export const todoRouter = Router();

todoRouter.use(requireAuth);

todoRouter.get('/', todo.list);
todoRouter.post('/', validate(createTodoSchema), todo.create);
todoRouter.patch('/:id', validate(updateTodoSchema), todo.update);
todoRouter.delete('/:id', todo.remove);