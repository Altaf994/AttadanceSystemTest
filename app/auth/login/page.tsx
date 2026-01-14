"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import LoginLogo from '../../../public/images/LoginLogo.jpg'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const payload = await res.json().catch(()=>({ message: 'Login failed' }))
        throw new Error(payload.message || 'Login failed')
      }

      const payload = await res.json().catch(() => null)
      const user = payload?.user

      if (typeof window !== 'undefined' && user?.id) {
        // Store minimal user details needed for check-in calls.
        window.localStorage.setItem(
          'vas_user',
          JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            service: user.service,
            serviceUnit: user.serviceUnit,
            active: user.active,
          })
        )
      }

      // Redirect to dashboard after successful login. If /dashboard is not present,
      // fallback to the root.
      try {
        router.push('/dashboard')
      } catch {
        router.push('/')
      }
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
          <h3 style={{ margin: 0, marginBottom: 8, color: '#000', fontWeight: 700 }}>Login Account</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }} />
            <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #e6e9ef', color: '#000' }} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ marginTop: 6, padding: '12px 16px', background: '#1e90ff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>{loading? 'Logging...' : 'Log In'}</button>
          </form>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <button onClick={()=>router.push('/auth/register')} style={{ background: 'transparent', border: 'none', color: '#1e90ff', cursor: 'pointer', fontWeight: 700 }}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}
