import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-orange-500 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600 rounded-full opacity-40" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-400 rounded-full opacity-30" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
              <Image src="/finalcitilogo.png" alt="CSC Travels" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="text-white font-black text-xl leading-tight">CSC Travels</p>
              <p className="text-orange-100 text-xs">Premium Cab Service, Patna</p>
            </div>
          </Link>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-4xl font-black leading-snug">
            Your ride,<br />
            <span className="text-orange-100">your way.</span>
          </h2>
          <p className="text-orange-100 text-base leading-relaxed max-w-xs">
            Reliable cab service across Patna — airport drops, outstation trips, and daily commutes.
            Book in seconds.
          </p>

          {/* Trust badges */}
          <div className="flex flex-col gap-3">
            {[
              '✓  Transparent pricing — no hidden charges',
              '✓  Real-time driver tracking',
              '✓  24 × 7 booking support',
            ].map(text => (
              <p key={text} className="text-orange-100 text-sm font-medium">{text}</p>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative z-10">
          <p className="text-orange-200 text-xs">
            Serving Patna since 2017 · Part of Citizen Cooperative
          </p>
        </div>
      </div>

      {/* ── Right: form area ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center overflow-hidden">
              <Image src="/finalcitilogo.png" alt="CSC Travels" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-black text-gray-900 text-sm">CSC Travels</span>
          </Link>
        </div>

        {/* Form centred */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer strip */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
          <Link href="/privacy-policy" className="hover:text-orange-500 transition">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-orange-500 transition">Terms</Link>
          <span>·</span>
          <span>© {new Date().getFullYear()} CSC Travels</span>
        </div>
      </div>
    </div>
  )
}
