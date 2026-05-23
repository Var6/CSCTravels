'use client'

import { useState } from 'react'

type Step = 'idle' | 'confirming' | 'submitting' | 'done' | 'error'

export default function DeleteAccountForm() {
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState('')
  const [confirmText, setConfirmText] = useState('')

  async function submit() {
    setStep('submitting')
    setError('')
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 401) {
          setError(
            'You are not signed in. Open the CSC Travel app or sign in on this website first, then return to this page.'
          )
        } else {
          setError(data.message || `Deletion failed (${res.status})`)
        }
        setStep('error')
        return
      }
      setStep('done')
    } catch (e) {
      setError(String(e))
      setStep('error')
    }
  }

  if (step === 'done') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <p className="font-semibold">Your account has been deleted.</p>
        <p className="mt-1 text-sm">
          Your personal information has been removed from our systems. Historical trip records are
          retained anonymously per our policy.
        </p>
      </div>
    )
  }

  if (step === 'confirming') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-700">This action cannot be undone.</p>
        <p className="mt-2 text-sm text-red-700">
          Type <strong>DELETE</strong> below to confirm.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE"
          className="mt-3 block w-full rounded-md border border-red-300 bg-white px-3 py-2 text-gray-900"
        />
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            disabled={confirmText !== 'DELETE'}
            onClick={submit}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50 hover:bg-red-700"
          >
            Permanently delete my account
          </button>
          <button
            onClick={() => {
              setStep('idle')
              setConfirmText('')
              setError('')
            }}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (step === 'submitting') {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-700">
        Deleting your account…
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
      <button
        onClick={() => setStep('confirming')}
        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
      >
        Delete my account
      </button>
      <p className="mt-3 text-xs text-gray-600">
        You must be signed in on this device. If you only have the mobile app, sign in first at{' '}
        <a href="/login" className="text-orange-600 underline">
          /login
        </a>
        .
      </p>
    </div>
  )
}
