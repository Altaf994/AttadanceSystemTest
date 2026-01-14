"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import LoginLogo from '../../../public/images/LoginLogo.jpg'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [serviceUnit, setServiceUnit] = useState("")
  const [service, setService] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, serviceUnit, service })
      })
      if (!res.ok) {
        const payload = await res.json().catch(()=>({ message: 'Registration failed' }))
        throw new Error(payload.message || 'Registration failed')
      }
      router.push('/auth/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f6fb' }}>
      <div className="auth-card">
        <div className="auth-left">
          <div className="poster">
            <Image src={LoginLogo} alt="Volunteers" className="poster" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} priority />
          </div>
        </div>

        <div className="auth-divider" />

        <div className="auth-right">
          <div className="mobile-logo"><Image src={LoginLogo} alt="logo" priority /></div>
          <h3 style={{ margin: 0, marginBottom: 8, color: '#000', fontWeight: 700 }}>CREATE ACCOUNT</h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Full name" type="text" value={name} onChange={(e)=>setName(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }} />
              <input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }} />
              <div className="auth-form-row">
                <select value={serviceUnit} onChange={(e)=>{ setServiceUnit(e.target.value); setService('') }} required className="half" style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }}>
                  <option value="">Select Service Unit</option>
                  <option value="Prayer Hall Management Unit">Prayer Hall Management Unit</option>
                  <option value="Safety and Security Unit">Safety and Security Unit</option>
                  <option value="Ancillary Service Unit">Ancillary Service Unit</option>
                </select>
                <select value={service} onChange={(e)=>setService(e.target.value)} required className="half" style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }}>
                  <option value="">Select Service</option>
                  {serviceUnit === 'Prayer Hall Management Unit' && (
                    <>
                      <option>Paat Service</option>
                      <option>Naandi Service</option>
                      <option>Audio Video Service</option>
                      <option>Flower Service</option>
                      <option>Facilitation Service</option>
                      <option>Jura/Tabaruk Service</option>
                      <option>Announcement and Notice Board Service</option>
                      <option>Nikah Service</option>
                      <option>Other</option>
                    </>
                  )}
                  {serviceUnit === 'Safety and Security Unit' && (
                    <>
                      <option>Safety and Security Service</option>
                      <option>Community Emergency and Response Team (CERT) Service</option>
                      <option>Facilitation Service</option>
                      <option>Elevator Service</option>
                      <option>Wheelchair Service</option>
                      <option>Other</option>
                    </>
                  )}
                  {serviceUnit === 'Ancillary Service Unit' && (
                    <>
                      <option>Decoration Service</option>
                      <option>Kitchen Service</option>
                      <option>Funeral Service</option>
                      <option>Landscaping Service</option>
                      <option>Transport Service</option>
                      <option>Shoe Service</option>
                      <option>Water Service</option>
                      <option>House Keeping Service</option>
                      <option>Maintenance Service</option>
                      <option>Child Care Service</option>
                      <option>Canteen Service</option>
                      <option>Pipe Band</option>
                      <option>Flute Band</option>
                      <option>Orchestra</option>
                      <option>Event Management Service</option>
                      <option>Other</option>
                    </>
                  )}
                </select>
              </div>
            <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }} />
            <input placeholder="Confirm password" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }} />
            <button type="submit" disabled={loading || !serviceUnit || !service || password.length < 6 || password !== confirm} style={{ marginTop: 6, padding: '12px 16px', background: (loading || !serviceUnit || !service || password.length < 6 || password !== confirm) ? '#9ec9ff' : '#1e90ff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>{loading? 'Creating...' : 'CREATE ACCOUNT'}</button>
          </form>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) router.back()
                else router.push('/auth/login')
              }}
              style={{ background: 'transparent', border: 'none', color: '#1e90ff', cursor: 'pointer' }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
