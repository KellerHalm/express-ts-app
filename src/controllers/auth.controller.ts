import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../db';
import { userId } from '../middleware/auth';
import { HttpError } from '../middleware/error';

const tokenFor = (id: string) =>
  jwt.sign({ sub: id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const isUniqueError = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });
    res.status(201).json({ token: tokenFor(user.id), user });
  } catch (e) {
    if (isUniqueError(e)) throw new HttpError(409, 'email already registered');
    throw e;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw new HttpError(401, 'invalid email or password');

  res.json({
    token: tokenFor(user.id),
    user: { id: user.id, email: user.email },
  });
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: userId(req) },
    select: { id: true, email: true },
  });
  if (!user) throw new HttpError(404, 'user not found');
  res.json(user);
};