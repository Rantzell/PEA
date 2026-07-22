import React, { useState } from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Avatar, Stars, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { deptCompletion } from '../data.js'

function OverrideModal({ employee, onClose }) {
  const { override } = useStore()
  const [val, setVal] = useState(employee.rating || 3)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-lg font-bold">Override Rating</h3>
        <p className="mb-4 text-sm text-slate-400">{employee.name} · {employee.dept}</p>
        <div className="mb-4 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setVal(n)} className={`text-3xl ${n <= val ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
          ))}
        </div>
        <div className="mb-4 text-center text-2xl font-bold">{val.toFixed(1)}</div>
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={() => { override(employee.id, val); onClose() }}>Apply Override</Button>
        </div>
      </div>
    </div>
  )
}

export function TowerHeadView({ view }) {
  const { employees, approve, reject, notify } = useStore()
  const [overrideTarget, setOverrideTarget] = useState(null)
  const [checked, setChecked] = useState({})
  const queue = employees.filter((e) => ['Awaiting Approval', 'Awaiting Review'].includes(e.status))
  const approved = employees.filter((e) => e.status === 'Approved').length + 12
  const rated = employees.filter((e) => e.rating)
  const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : '—'

  const dist = [
    ['Outstanding (5.0)', rated.filter((e) => e.rating >= 5).length + 2, '#10b981'],
    ['Excellent (4-4.9)', rated.filter((e) => e.rating >= 4 && e.rating < 5).length + 5, '#6366f1'],
    ['Good (3-3.9)', rated.filter((e) => e.rating >= 3 && e.rating < 4).length + 1, '#f59e0b'],
    ['Needs Impr. (<3)', rated.filter((e) => e.rating < 3).length, '#c8102e'],
  ]

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tower Head Console</h1>
          <p className="mt-1 text-slate-500">Final approval authority · Rate overrides · HR submission.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">⚡ TOWER HEAD</span>
      </div>

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Approval Queue" value={queue.length} sub="Awaiting final sign-off" icon={Icon.check} tint="bg-red-100 text-brand" />
        <StatCard label="Approved This Cycle" value={approved} sub="Submitted to HR" icon={Icon.check} tint="bg-emerald-100 text-emerald-600" />
        <StatCard label="Rating Overrides" value={3} sub="Pending review" icon={Icon.sliders} tint="bg-amber-100 text-amber-600" />
        <StatCard label="Avg Cycle Rating" value={avg} sub="Org-wide" icon={Icon.chart} tint="bg-indigo-100 text-indigo-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Approval Queue</h2>
            <span className="text-sm text-slate-400">{queue.length} pending</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {queue.length === 0 && <p className="py-8 text-center text-slate-400">Queue is clear. 🎉</p>}
            {queue.map((e) => (
              <div key={e.id} className="flex items-center gap-3 py-4">
                <input type="checkbox" checked={!!checked[e.id]} onChange={() => setChecked((c) => ({ ...c, [e.id]: !c[e.id] }))} className="h-4 w-4 accent-brand" />
                <Avatar initials={e.initials} color={e.color} size={40} />
                <div className="w-44"><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.dept} · {e.type}</div></div>
                {e.rating && <Stars value={e.rating} />}
                <div className="ml-auto flex gap-2">
                  <Button variant="green" onClick={() => approve(e.id)}>{Icon.thumb} Approve</Button>
                  <Button variant="ghost" onClick={() => setOverrideTarget(e)}>{Icon.sliders} Override</Button>
                  <Button variant="red" onClick={() => reject(e.id)}>{Icon.x} Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-bold">Department Performance</h2>
            <div className="space-y-3">
              {deptCompletion.map((d, i) => (
                <div key={d.dept} className="flex items-center gap-3 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="font-medium">{d.dept}</span>
                  <span className="ml-auto text-slate-400">{[4, 2, 1, 1, 1][i]} reviews</span>
                  <span className="w-8 font-bold">{[4.3, 4.6, 4.7, 2.8, 3.9][i]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold">HR Submission</h2>
            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Ready to Submit</div>
              <div className="my-1 text-3xl font-extrabold">{approved}</div>
              <div className="text-sm text-slate-500">evaluations approved</div>
            </div>
            <Button className="mt-4 w-full" onClick={() => notify(`Submitted ${approved} evaluations to HR`)}>{Icon.send} Submit to HR</Button>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold">Evaluation Distribution</h2>
            <div className="space-y-3">
              {dist.map(([label, n, color]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm font-medium"><span>{label}</span><span className="font-bold">{n}</span></div>
                  <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(n * 12, 100)}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {overrideTarget && <OverrideModal employee={overrideTarget} onClose={() => setOverrideTarget(null)} />}
    </>
  )
}
