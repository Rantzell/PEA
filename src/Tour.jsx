import React, { useState, useLayoutEffect, useEffect } from 'react'

// Interactive guided walkthrough: spotlights elements by [data-tour] and
// steps through them with Back / Next / Finish. No external dependency.
const STEPS = [
  { key: 'role', title: 'Switch your role', body: 'Everything in PEA is role-based. Use this switcher to move between Resource, Manager, Tower Head, HR Admin and System Admin.' },
  { key: 'nav', title: 'Navigate the app', body: 'The sidebar changes with your role. Each item opens a different workspace — dashboards, evaluations, approvals and reports.' },
  { key: 'stats', title: 'Key metrics at a glance', body: 'These cards summarise the numbers that matter for your role — completion, ratings, sync health and more.' },
  { key: 'main', title: 'Your main workspace', body: 'This is where the action happens: review evaluations, approve, override, publish or drill into records.' },
  { key: 'cta', title: 'Start something new', body: 'This action button starts a new evaluation, questionnaire or sync depending on your role.' },
  { key: 'search', title: 'Find anything fast', body: 'Search across employees, evaluations and questionnaires from here.' },
  { key: 'theme', title: 'Light & dark mode', body: 'Toggle a comfortable theme any time. Your choice is remembered.' },
  { key: 'help', title: 'Replay this manual', body: 'Stuck later? Click here to replay this step-by-step walkthrough whenever you like.' },
]

export function useTour() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('pea-tour-seen')) setOpen(true)
  }, [])
  const start = () => setOpen(true)
  const finish = () => { setOpen(false); localStorage.setItem('pea-tour-seen', '1') }
  return { open, start, finish }
}

export function Tour({ open, onFinish }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const step = STEPS[i]

  useLayoutEffect(() => {
    if (!open) return
    setI(0)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const el = document.querySelector(`[data-tour="${step.key}"]`)
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      const r = el.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    } else {
      setRect(null)
    }
  }, [i, open, step])

  if (!open) return null

  const pad = 8
  const box = rect && {
    top: rect.top - pad, left: rect.left - pad,
    width: rect.width + pad * 2, height: rect.height + pad * 2,
  }
  // place tooltip below the highlight, or centered if no target
  const tipTop = box ? Math.min(box.top + box.height + 12, window.innerHeight - 220) : window.innerHeight / 2 - 100
  const tipLeft = box ? Math.min(Math.max(box.left, 16), window.innerWidth - 340) : window.innerWidth / 2 - 160

  const next = () => (i < STEPS.length - 1 ? setI(i + 1) : onFinish())
  const back = () => setI(Math.max(0, i - 1))

  return (
    <div className="fixed inset-0 z-[100]">
      {/* dim overlay with a "hole" via 4 panels around the highlight */}
      {box ? (
        <>
          <div className="absolute bg-black/60" style={{ top: 0, left: 0, right: 0, height: box.top }} />
          <div className="absolute bg-black/60" style={{ top: box.top + box.height, left: 0, right: 0, bottom: 0 }} />
          <div className="absolute bg-black/60" style={{ top: box.top, left: 0, width: box.left, height: box.height }} />
          <div className="absolute bg-black/60" style={{ top: box.top, left: box.left + box.width, right: 0, height: box.height }} />
          <div className="absolute rounded-xl ring-4 ring-brand transition-all"
            style={{ top: box.top, left: box.left, width: box.width, height: box.height }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/60" />
      )}

      <div className="absolute w-80 rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-800" style={{ top: tipTop, left: tipLeft }}>
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-brand">
          Step {i + 1} of {STEPS.length}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{step.body}</p>

        <div className="mt-3 flex items-center gap-1.5">
          {STEPS.map((_, n) => (
            <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-5 bg-brand' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={onFinish} className="text-sm font-medium text-slate-400 hover:text-slate-600">Skip</button>
          <div className="flex gap-2">
            {i > 0 && (
              <button onClick={back} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200">Back</button>
            )}
            <button onClick={next} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              {i < STEPS.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
