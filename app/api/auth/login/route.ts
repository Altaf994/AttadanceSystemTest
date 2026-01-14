import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import prisma from '@/lib/prisma'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      endpoint: '/api/auth/login',
      methods: ['POST'],
      message: 'Use POST to login.',
    },
    { status: 200 }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}

    if (!isNonEmptyString(email)) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    if (!isNonEmptyString(password)) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        service: true,
        serviceUnit: true,
        active: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ ok: true, user: userWithoutPassword })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
