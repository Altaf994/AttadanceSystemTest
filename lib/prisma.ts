import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  // allow global `var` across module reloads in development
  var prisma: PrismaClient | undefined
  var pgPool: Pool | undefined
}

const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') global.pgPool = pool

const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
  })
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
