import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'route not found' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'validation failed', issues: err.issues });
    return;
  }
  const status = err instanceof HttpError ? err.status : 500;
  res.status(status).json({ error: err.message ?? 'internal error' });
};