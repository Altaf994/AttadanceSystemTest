"use client"

import { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function CheckInPage() {
  const router = useRouter()
  const [volunteerId, setVolunteerId] = useState('')
  const [volunteerName, setVolunteerName] = useState('')
  const [event, setEvent] = useState('')
  const [takenByUserId, setTakenByUserId] = useState('')
  const [service, setService] = useState<string | null>(null)
  const [serviceUnit, setServiceUnit] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const qpEvent = params.get('event')
      if (qpEvent) setEvent(qpEvent)
    } catch {
      // ignore
    }

    try {
      const raw = window.localStorage.getItem('vas_user')
      if (!raw) {
        router.push('/auth/login')
        return
      }
      const parsed = JSON.parse(raw) as Record<string, unknown>
      const id = typeof parsed?.id === 'string' ? parsed.id : ''
      if (!id) {
        router.push('/auth/login')
        return
      }
      setTakenByUserId(id)
      setService(typeof parsed.service === 'string' ? parsed.service : null)
      setServiceUnit(typeof parsed.serviceUnit === 'string' ? parsed.serviceUnit : null)
    } catch {
      router.push('/auth/login')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volunteerId,
          volunteerName,
          takenByUserId,
          service: service ?? undefined,
          serviceUnit: serviceUnit ?? undefined,
          event,
          actionAt: new Date().toISOString(),
          actionAtClient: moment.tz(new Date(), 'Asia/Karachi').format('YYYY-MM-DD hh:mm A'),
        }),
      })

      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(payload?.message || 'Check-in request failed')
      }

      setMessage(payload?.action === 'checked_out' ? 'Checked out.' : 'Checked in.')

      const action = payload?.action === 'checked_out' ? 'Checked out' : 'Checked in'
      const ts =
        payload?.action === 'checked_out'
          ? payload?.checkIn?.checkoutAt
          : payload?.checkIn?.checkinAt
      const formatted = ts || ''

      toast.success(
        formatted
          ? `Attendance marked successfully (${action} at ${formatted})`
          : 'Attendance marked successfully'
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f6fb' }}>
      <div style={{ width: 540, padding: 28, boxShadow: '0 12px 40px rgba(2,10,40,0.12)', borderRadius: 12, background: '#fff' }}>
        <h3 style={{ margin: 0, marginBottom: 12, color: '#000' }}>Volunteer Check-in</h3>
        <p style={{ marginTop: 0, marginBottom: 16, color: '#666' }}>
          Enter volunteer details + eventId to check-in (or check-out if already checked in).
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Volunteer ID"
            value={volunteerId}
            onChange={(e) => setVolunteerId(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }}
          />
          <input
            placeholder="Volunteer Name"
            value={volunteerName}
            onChange={(e) => setVolunteerName(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }}
          />
          <input
            placeholder="Event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }}
          />

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <div style={{ fontSize: 12, color: '#444' }}>
              <strong>Service Unit:</strong> {serviceUnit || '—'}
            </div>
            <div style={{ fontSize: 12, color: '#444' }}>
              <strong>Service:</strong> {service || '—'}
            </div>
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}
          {message && <div style={{ color: 'green' }}>{message}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 6, padding: '12px 16px', background: '#1e90ff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
