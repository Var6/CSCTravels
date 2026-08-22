import React from 'react'

/**
 * The X (formerly Twitter) brand mark. lucide-react's `X` is the close/times
 * icon, and its `Twitter` icon is the retired bird, so the current logo is a
 * small inline SVG. Colour follows `currentColor`; size via className.
 */
export default function XLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
