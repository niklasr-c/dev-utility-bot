import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { env } from '../config/env';

// 1. Wir geben dem Adapter einfach nur unsere URL
const adapter = new PrismaBetterSqlite3({
  url: env.DATABASE_URL,
});

// 2. Wir starten den Client mit dem Adapter
export const prisma = new PrismaClient({ adapter });