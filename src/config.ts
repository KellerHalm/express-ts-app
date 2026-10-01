export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  jwtExpiresIn: '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
} as const;