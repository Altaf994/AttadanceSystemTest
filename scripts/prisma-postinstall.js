#!/usr/bin/env node
const { spawnSync } = require('child_process')

if (!process.env.DATABASE_URL) {
  console.warn('Skipping prisma generate: DATABASE_URL is not set.')
  process.exit(0)
}

console.log('Running prisma generate...')
const res = spawnSync('npx', ['prisma', 'generate'], { stdio: 'inherit' })
process.exit(res.status)
