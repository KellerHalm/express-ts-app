import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { HttpError } from './error';

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? '';
  if (!header.startsWith('Bearer ')) {
    next(new HttpError(401, 'authorization header required'));
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret) as jwt.JwtPayload;
    req.userId = String(payload.sub);
    next();
  } catch {
    next(new HttpError(401, 'invalid or expired token'));
  }
};

export const userId = (req: Request): string => {
  if (!req.userId) throw new HttpError(401, 'unauthorized');
  return req.userId;
};