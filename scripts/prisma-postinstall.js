#!/usr/bin/env node
const { spawnSync } = require('child_process')

console.log('Running prisma generate...')
const res = spawnSync('npx', ['prisma', 'generate'], { stdio: 'inherit' })
process.exit(res.status)
