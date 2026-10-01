import { app } from './app';
import { config } from './config';
import { prisma } from './db';

const server = app.listen(config.port, () =>
  console.log(`http://localhost:${config.port}`),
);

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);