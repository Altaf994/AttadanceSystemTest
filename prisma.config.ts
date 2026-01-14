import 'dotenv/config'
import { PrismaConfig } from '@prisma/cli'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL in environment')
}

const config: PrismaConfig = {
  datasource: {
    url: databaseUrl,
  },
}

export default config
