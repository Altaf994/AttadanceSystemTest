import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: { occasion: true }
    })
    const occasions = events.map(event => event.occasion)
    return NextResponse.json(occasions)
  } catch (error) {
    console.error('Error fetching occasions:', error)
    return NextResponse.json({ error: 'Failed to fetch occasions' }, { status: 500 })
  }
}