import { NextResponse } from 'next/server'
import moment from 'moment-timezone'

import prisma from '@/lib/prisma'

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      endpoint: '/api/checkin',
      methods: ['POST'],
      message: 'Use POST with { volunteerId, volunteerName?, service?, serviceUnit?, eventId, takenByUserId? } to check-in/out.',
    },
    { status: 200 }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const { volunteerId, volunteerName, takenByUserId, service, serviceUnit, event, actionAt, actionAtClient } = (body ?? {}) as {
      volunteerId?: string
      volunteerName?: string
      takenByUserId?: string
      service?: string
      serviceUnit?: string
      event?: string
      actionAt?: string
      actionAtClient?: string
    }

    if (!volunteerId || !volunteerName || !event) {
      return NextResponse.json(
        { message: 'volunteerId, volunteerName, and event are required' },
        { status: 400 }
      )
    }

    // Toggle behavior: if there's an open check-in for this volunteer+event, check-out; otherwise check-in.
    const existingOpen = await prisma.checkIn.findFirst({
      where: {
        volunteerId,
        event,
        checkoutAt: null,
      },
      orderBy: { checkinAt: 'desc' },
    })

    if (existingOpen) {
      // Use database NOW() as authoritative
      const updated = await prisma.$queryRaw`
        UPDATE "CheckIn" SET "checkoutAt" = NOW(), "checkoutAtClient" = ${actionAtClient} WHERE id = ${existingOpen.id}
        RETURNING *
      ` as any

      const resp = {
        ...updated,
        checkinAt: updated.checkinAt ? moment.tz(updated.checkinAt, 'Asia/Karachi').format('YYYY-MM-DD hh:mm A') : null,
        checkoutAt: updated.checkoutAt ? moment.tz(updated.checkoutAt, 'Asia/Karachi').format('YYYY-MM-DD hh:mm A') : null,
        checkinAtClient: updated.checkinAtClient ?? actionAtClient ?? null,
        checkoutAtClient: updated.checkoutAtClient ?? actionAtClient ?? null,
      }

      return NextResponse.json({ ok: true, action: 'checked_out', checkIn: resp })
    }

    // For new check-ins, use database NOW() as authoritative
    const created = await prisma.$queryRaw`
      INSERT INTO "CheckIn" (id, "volunteerId", "volunteerName", "takenByUserId", service, "serviceUnit", event, "checkinAt", "checkinAtClient")
      VALUES (gen_random_uuid(), ${volunteerId}, ${volunteerName}, ${takenByUserId}, ${service}, ${serviceUnit}, ${event}, NOW(), ${actionAtClient})
      RETURNING *
    ` as any

    const resp = {
      ...created,
      checkinAt: created.checkinAt ? moment.tz(created.checkinAt, 'Asia/Karachi').format('YYYY-MM-DD hh:mm A') : null,
      checkoutAt: created.checkoutAt ? moment.tz(created.checkoutAt, 'Asia/Karachi').format('YYYY-MM-DD hh:mm A') : null,
      checkinAtClient: created.checkinAtClient ?? actionAtClient ?? null,
    }

    return NextResponse.json({ ok: true, action: 'checked_in', checkIn: resp })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
