import React from 'react'

// Seven Seven "7" mark: inverted triangle with a slash forming a 7.
export function Mark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M6 8 H42 L24 42 Z" stroke="#c8102e" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
      <path d="M30 8 L18 42" stroke="#c8102e" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ light = true, size = 'md' }) {
  const s = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size]
  return (
    <div className="flex items-center gap-2 select-none">
      <Mark size={size === 'lg' ? 40 : 30} />
      <span className={`font-black tracking-[0.25em] ${s} ${light ? 'text-white' : 'text-slate-900'}`}>
        SEVEN<span className="text-brand">SEVEN</span>
      </span>
    </div>
  )
}
