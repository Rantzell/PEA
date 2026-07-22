import React from 'react'

export const statusStyles = {
  'In Progress': 'bg-amber-100 text-amber-700',
  'Awaiting Approval': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Needs Re-evaluation': 'bg-red-100 text-red-600',
  'Not Started': 'bg-slate-200 text-slate-600',
  'Awaiting Review': 'bg-orange-100 text-orange-700',
  'Approved': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-red-100 text-red-600',
  'Published': 'bg-emerald-100 text-emerald-700',
  'Draft': 'bg-amber-100 text-amber-700',
}

export function Badge({ status, dot }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-slate-200 text-slate-600'}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status}
    </span>
  )
}

export function Avatar({ initials, color, size = 44 }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-xl font-bold text-white"
      style={{ background: color, width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
    </div>
  )
}

export function ProgressBar({ pct, color = '#c8102e' }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function Stars({ value }) {
  if (value == null) return null
  const full = Math.round(value)
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-amber-400">
        {'★★★★★'.split('').map((_, i) => (
          <span key={i} className={i < full ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>★</span>
        ))}
      </span>
      <span className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">{value.toFixed(1)}</span>
    </span>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, icon, tint = 'bg-slate-100 text-slate-600' }) {
  return (
    <Card className="!p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}>{icon}</span>
      </div>
      <div className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</div>
      {sub && <div className="mt-1 text-sm text-slate-400">{sub}</div>}
    </Card>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200',
    green: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300',
  }
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
