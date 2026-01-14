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
      endpoint: '/api/auth/register',
      methods: ['POST'],
      message: 'Use POST to register a user.',
    },
    { status: 200 }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, service, serviceUnit } = body || {}

    if (!isNonEmptyString(email)) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    if (!isNonEmptyString(password)) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name: isNonEmptyString(name) ? name.trim() : null,
        password: hashedPassword,
        service: isNonEmptyString(service) ? service.trim() : null,
        serviceUnit: isNonEmptyString(serviceUnit) ? serviceUnit.trim() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        service: true,
        serviceUnit: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ ok: true, user })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
