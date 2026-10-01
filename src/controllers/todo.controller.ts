import type { Request, Response } from 'express';
import { prisma } from '../db';
import { userId } from '../middleware/auth';
import { HttpError } from '../middleware/error';
import { listQuerySchema } from '../schemas/todo.schema';

const select = { id: true, title: true, done: true, createdAt: true, updatedAt: true } as const;

export const list = async (req: Request, res: Response) => {
  const { done, search } = listQuerySchema.parse(req.query);
  const items = await prisma.todo.findMany({
    where: {
      userId: userId(req),
      ...(done !== undefined ? { done: done === 'true' } : {}),
      ...(search ? { title: { contains: search } } : {}),
    },
    select,
    orderBy: { createdAt: 'asc' },
  });
  res.json(items);
};

export const create = async (req: Request, res: Response) => {
  const todo = await prisma.todo.create({
    data: { userId: userId(req), title: req.body.title },
    select,
  });
  res.status(201).json(todo);
};

export const update = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await prisma.todo.updateMany({
    where: { id, userId: userId(req) },
    data: req.body,
  });
  if (result.count === 0) throw new HttpError(404, 'todo not found');
  res.json(await prisma.todo.findUniqueOrThrow({ where: { id }, select }));
};

export const remove = async (req: Request, res: Response) => {
  const result = await prisma.todo.deleteMany({
    where: { id: String(req.params.id), userId: userId(req) },
  });
  if (result.count === 0) throw new HttpError(404, 'todo not found');
  res.status(204).end();
};