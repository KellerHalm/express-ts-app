import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'validation failed', issues: result.error.issues });
      return;
    }
    req.body = result.data;
    next();
  };