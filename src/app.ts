import cors from 'cors';
import express from 'express';
import { config } from './config';
import { errorHandler, notFound } from './middleware/error';
import { apiRouter } from './routers';

export const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);