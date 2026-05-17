'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Phone, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  const isPhone = /^\d/.test(identifier)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Login failed'); return }
      login(data.token, data.user)
      const next = new URLSearchParams(window.location.search).get('next') || '/booking'
      router.push(next)
    } catch {
      setError('Network error. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">Sign in to book your ride across Patna</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifier */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email or Phone</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {isPhone ? <Phone size={15} /> : <Mail size={15} />}
            </span>
            <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder="email@example.com or 9873101537" required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <Link href="#" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Forgot password?</Link>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={15} /></span>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
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

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">New to CSC Travels?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Link href="/register"
        className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-orange-200 text-orange-600 font-bold text-sm hover:bg-orange-50 transition">
        Create an account
      </Link>
    </div>
  )
}
