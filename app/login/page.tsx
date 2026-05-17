'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, Phone, Mail, Lock, ArrowRight, Car } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isPhone = /^\d/.test(identifier)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Login failed')
        return
      }
      login(data.token, data.user)
      const next = new URLSearchParams(window.location.search).get('next') || '/booking'
      router.push(next)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen hero-grid flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background blurs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-300/25 blur-3xl" />

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
                Welcome back
              </h1>
            </div>
          </div>
          <p className="text-slate-500 text-sm text-center">Sign in to book your ride across Patna</p>
        </div>

        {/* Card */}
        <div className="surface rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Identifier field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email or Phone
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {isPhone ? <Phone size={16} /> : <Mail size={16} />}
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="email@example.com or 9873101537"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e9dcc3] bg-[#fffaf0] text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#d97706] hover:text-[#b45309] font-medium transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#e9dcc3]" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-[#e9dcc3]" />
          </div>

          {/* Quick demo note */}
          <div className="bg-[#fff8ea] border border-[#f59e0b]/30 rounded-xl px-4 py-3 flex gap-3 items-start">
            <Car size={16} className="text-[#d97706] mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Driver?</span> Register with role{' '}
              <code className="bg-white/70 px-1 rounded text-[#2563eb] font-mono text-[11px]">driver</code>{' '}
              to accept rides and earn with CSC Travels.
            </p>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          New to CSC Travels?{' '}
          <Link href="/register" className="text-[#2563eb] font-bold hover:text-[#1d4ed8] transition">
            Create an account
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
