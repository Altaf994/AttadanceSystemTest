import 'dotenv/config'
import { PrismaConfig } from '@prisma/cli'

// Use DATABASE_URL when available, but don't fail generation if it's missing.
// Prisma Client generation does not require a live database connection.
const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/db'

const config: PrismaConfig = {
  datasource: {
    url: databaseUrl,
  },
}

export default config
