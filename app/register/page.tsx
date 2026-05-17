'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
    <main className="min-h-screen hero-grid flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blurs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-300/25 blur-3xl" />

      <div className="rise-in w-full max-w-md relative z-10">
        {/* Logo & brand */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl border border-[#f59e0b]/40 bg-white/80 shadow flex items-center justify-center overflow-hidden">
              <Image src="/finalcitilogo.png" alt="CSC Travels" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#d97706] tracking-widest uppercase">CSC Travels</p>
              <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: 'var(--font-sora)' }}>
                Create account
              </h1>
            </div>
          </div>
          <p className="text-slate-500 text-sm text-center">Join thousands riding smart across Patna</p>
        </div>

        {/* Card */}
        <div className="surface rounded-3xl p-8 shadow-xl">

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-[#fff1cc] rounded-xl">
            {([['user', 'Rider', Users], ['driver', 'Driver', Car]] as const).map(([r, label, Icon]) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${
                  role === r
                    ? 'bg-white text-[#2563eb] shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Rahul Kumar"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="9873101537"
                  required
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="rahul@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-slate-500 leading-relaxed">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-[#2563eb] font-medium hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-[#2563eb] font-medium hover:underline">
                Privacy Policy
              </Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-md shadow-blue-200"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2563eb] font-bold hover:text-[#1d4ed8] transition">
            Sign in
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
