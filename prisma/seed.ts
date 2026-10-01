import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

await prisma.user.upsert({
  where: { email: 'demo@example.com' },
  update: {},
  create: {
    email: 'demo@example.com',
    passwordHash: await bcrypt.hash('password1', 10),
  },
});

await prisma.$disconnect();