'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Phone, Mail, Lock, User, ArrowRight, Car, Users } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

type Role = 'user' | 'driver'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [role, setRole] = useState<Role>('user')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Registration failed')
        return
      }
      login(data.token, data.user)
      router.push('/booking')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Create account</h1>
        <p className="text-gray-500 text-sm mt-1">Join thousands riding smart across Patna</p>
      </div>

      {/* Role selector */}
      <div className="flex gap-2 p-1 bg-orange-50 rounded-xl border border-orange-100">
        {([['user', 'Rider', Users], ['driver', 'Driver', Car]] as const).map(([r, label, Icon]) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${
              role === r
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><User size={15} /></span>
            <input type="text" value={form.name} onChange={set('name')}
              placeholder="Rahul Kumar" required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={15} /></span>
            <input type="tel" value={form.phone} onChange={set('phone')}
              placeholder="9873101537" required maxLength={10}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={15} /></span>
            <input type="email" value={form.email} onChange={set('email')}
              placeholder="rahul@example.com" required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={15} /></span>
            <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
              placeholder="Min. 6 characters" required
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition" />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <p className="text-xs text-gray-500 leading-relaxed">
          By registering, you agree to our{' '}
          <Link href="/terms" className="text-orange-500 font-medium hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy-policy" className="text-orange-500 font-medium hover:underline">Privacy Policy</Link>.
        </p>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">Already have an account?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Link href="/login"
        className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-orange-200 text-orange-600 font-bold text-sm hover:bg-orange-50 transition">
        Sign in instead
      </Link>
    </div>
  )
}
