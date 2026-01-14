import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

async function main() {
  const occasions = [
    'BIRTHDAY OF HAZRAT ALI (A.S.)',
    'SHAB-E-MAIRAJ',
    'IMAMAT DAY MUBARAK',
    'LAILAT-UL-QADR (Evening)',
    'LAILAT-UL-QADR (Morning)',
    'EID-UL-FITR',
    'NAVROZ MUBARAK',
    'EID-UL-AZHA',
    'EID-E-GHADIR',
    'EID-E-MILAD-UN-NABI (S.A.S.)',
    'SALGIRAH MUBARAK OF MAWLANA HAZAR IMAM (S.A.)',
    'BIRTHDAY OF HAZRAT IMAM (A.S.)',

    // Majlis
    'Life Majlis',
    'FRec khushyalioorani Majlis',
    '1/4th  Majlis',
    'Paanch Bara Saal Majlis',
    'Baitul Khayal Majlis',
    'Samar Chhata Majlis',
    'Aam Panje Bhai Majlis',
    'Chand Raat Majlis',
    'Rohani Majlis',
    'Rec khushyali Majlis'
  ]

  for (const occasion of occasions) {
    const normalized = occasion.trim().replace(/\s+/g, ' ')
    await prisma.event.upsert({
      where: { occasion: normalized },
      update: {},
      create: { occasion: normalized }
    })
  }

  console.log(`Seeded ${occasions.length} occasions into Event table`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
    await prisma.$disconnect()
  })
