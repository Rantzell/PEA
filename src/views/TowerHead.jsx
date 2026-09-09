import React, { useState } from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Avatar, Stars, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { deptCompletion } from '../data.js'

const TOWER_HEAD_NAME = 'Juan Dela Cruz'

const DEPT_TOWER = {
  Engineering: 'Application Development and Support',
  Design: 'Application Development and Support',
  Product: 'Application Development and Support',
  Sales: 'Infrastructure Maintenance and Support',
  Marketing: 'Infrastructure Maintenance and Support',
  Finance: 'Infrastructure Maintenance and Support',
  Legal: 'Infrastructure Maintenance and Support',
}

function OverrideModal({ employee, onClose }) {
  const { override } = useStore()
  const [val, setVal] = useState(employee.rating || 3)
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
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
  const { employees, approve, reject, submitToHR, teams } = useStore()
  const [overrideTarget, setOverrideTarget] = useState(null)
  const [checked, setChecked] = useState({})
  const [openTower, setOpenTower] = useState(null)
  const [openOverrideTower, setOpenOverrideTower] = useState(null)
  const queue = employees.filter((e) => ['Awaiting Approval', 'Awaiting Review'].includes(e.status))
  const approvedList = employees.filter((e) => e.status === 'Approved' && !e.submittedToHR)
  const approvedPending = approvedList.length
  const submittedToHR = employees.filter((e) => e.status === 'Approved' && e.submittedToHR).length + 12
  const rated = employees.filter((e) => e.rating)
  const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : '—'

  const dist = [
    ['Exceptional', rated.filter((e) => e.rating >= 4.5).length + 2, '#10b981'],
    ['Exceeds Expectation', rated.filter((e) => e.rating >= 4 && e.rating < 4.5).length + 3, '#6366f1'],
    ['Meets Expectation', rated.filter((e) => e.rating >= 3 && e.rating < 4).length + 3, '#f59e0b'],
    ['Needs Improvement', rated.filter((e) => e.rating >= 2 && e.rating < 3).length + 1, '#f97316'],
    ['Unsatisfactory', rated.filter((e) => e.rating < 2).length, '#c8102e'],
  ]

  const ApprovalQueue = ({ full }) => {
    const groups = queue.reduce((acc, e) => {
      const tower = DEPT_TOWER[e.dept] || e.dept
      ;(acc[tower] ||= []).push(e)
      return acc
    }, {})

    return (
      <Card className={full ? '' : 'lg:col-span-2'} data-tour="main">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Approval Queue</h2>
          <span className="text-sm text-slate-400">{queue.length} pending</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((tower) => {
            const members = groups[tower] || []
            return (
              <button
                key={tower}
                onClick={() => setOpenTower(tower)}
                className="rounded-xl border border-slate-100 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg dark:border-slate-700"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20">{Icon.users}</div>
                <div className="font-bold leading-snug">{tower}</div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-extrabold">{members.length}</span>
                  <span className="text-sm text-slate-400">pending</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    )
  }

  const TowerModal = ({ tower, onClose }) => {
    const members = queue.filter((e) => (DEPT_TOWER[e.dept] || e.dept) === tower)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{tower}</h3>
              <p className="text-sm text-slate-400">{members.length} pending approval</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">{Icon.x}</button>
          </div>
          <div className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
            {members.length === 0 && <p className="py-8 text-center text-slate-400">No pending approvals in this team.</p>}
            {members.map((e) => (
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
        </div>
      </div>
    )
  }

  const DeptPerformance = () => (
    <Card>
      <h2 className="mb-4 text-lg font-bold">Account / Department Performance</h2>
      <div className="space-y-3">
        {deptCompletion.map((d, i) => (
          <div key={d.dept} className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="font-medium">Account {i + 1}</span>
            <span className="ml-auto text-slate-400">{[4, 2, 1, 1, 1][i]} reviews</span>
            <span className="w-8 font-bold">{[4.3, 4.6, 4.7, 2.8, 3.9][i]}</span>
          </div>
        ))}
      </div>
    </Card>
  )

  const HRSubmission = ({ full }) => (
    <Card>
      <h2 className="mb-4 text-lg font-bold">HR Submission</h2>
      <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
        <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Ready to Submit</div>
        <div className="my-1 text-3xl font-extrabold">{approvedPending}</div>
        <div className="text-sm text-slate-500">approved, not yet submitted to HR</div>
      </div>
      {full && approvedList.length > 0 && (
        <div className="mt-4 max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-100 dark:divide-slate-700 dark:border-slate-700">
          {approvedList.map((e) => (
            <div key={e.id} className="flex items-center gap-3 px-3 py-3">
              <Avatar initials={e.initials} color={e.color} size={36} />
              <div><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.dept} · {e.type}</div></div>
              {e.rating && <span className="ml-auto"><Stars value={e.rating} /></span>}
            </div>
          ))}
        </div>
      )}
      <Button className="mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={approvedPending === 0} onClick={submitToHR}>{Icon.send} Submit to HR</Button>
    </Card>
  )

  const Distribution = () => (
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
  )

  // Rating Overrides page: every rated evaluation, each with an Override action
  const OverridesPage = () => {
    const groups = rated.reduce((acc, e) => {
      const tower = DEPT_TOWER[e.dept] || e.dept
      ;(acc[tower] ||= []).push(e)
      return acc
    }, {})

    return (
      <Card>
        <h2 className="mb-1 text-lg font-bold">Rating Overrides</h2>
        <p className="mb-4 text-sm text-slate-400">Adjust a final rating before it is submitted to HR.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((tower) => {
            const members = groups[tower] || []
            return (
              <button
                key={tower}
                onClick={() => setOpenOverrideTower(tower)}
                className="rounded-xl border border-slate-100 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg dark:border-slate-700"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20">{Icon.users}</div>
                <div className="font-bold leading-snug">{tower}</div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-extrabold">{members.length}</span>
                  <span className="text-sm text-slate-400">rated</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    )
  }

  const OverrideTowerModal = ({ tower, onClose }) => {
    const members = rated.filter((e) => (DEPT_TOWER[e.dept] || e.dept) === tower)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{tower}</h3>
              <p className="text-sm text-slate-400">{members.length} rated evaluations</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">{Icon.x}</button>
          </div>
          <div className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
            {members.length === 0 && <p className="py-8 text-center text-slate-400">No rated evaluations in this team.</p>}
            {members.map((e) => (
              <div key={e.id} className="flex items-center gap-3 py-4">
                <Avatar initials={e.initials} color={e.color} size={40} />
                <div className="w-44"><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.dept} · {e.type}</div></div>
                <Stars value={e.rating} />
                <div className="ml-auto"><Button onClick={() => setOverrideTarget(e)}>{Icon.sliders} Override</Button></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const header = {
    Dashboard: [TOWER_HEAD_NAME, 'Final approval authority · Rate overrides · HR submission.'],
    'Approval Queue': ['Approval Queue', 'Give final sign-off on submitted evaluations.'],
    'Rating Overrides': ['Rating Overrides', 'Override final ratings before HR submission.'],
    'HR Submission': ['HR Submission', 'Send approved evaluations to Human Resources.'],
    Reports: ['Reports', 'Account/department performance and rating distribution.'],
  }[view] || [TOWER_HEAD_NAME, '']

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{header[0]}</h1>
          <p className="mt-1 text-slate-500">{header[1]}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">⚡ TOWER HEAD</span>
      </div>

      {view === 'Approval Queue' && <ApprovalQueue full />}
      {view === 'Rating Overrides' && <OverridesPage />}
      {view === 'HR Submission' && (
        <div className="grid gap-6 lg:grid-cols-2"><HRSubmission full /><Distribution /></div>
      )}
      {view === 'Reports' && (
        <>
          <div data-tour="stats" className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Approval Queue" value={queue.length} sub="Awaiting final sign-off" icon={Icon.check} tint="bg-red-100 text-brand" />
            <StatCard label="Approved This Cycle" value={approvedPending} sub="Approved, not yet submitted to HR" icon={Icon.check} tint="bg-emerald-100 text-emerald-600" />
            <StatCard label="Submitted to HR" value={submittedToHR} sub="Sent to HR this cycle" icon={Icon.send} tint="bg-sky-100 text-sky-600" />
            <StatCard label="Rating Overrides" value={3} sub="Pending review" icon={Icon.sliders} tint="bg-amber-100 text-amber-600" />
            <StatCard label="Avg Cycle Rating" value={avg} sub="Org-wide" icon={Icon.chart} tint="bg-indigo-100 text-indigo-600" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2"><DeptPerformance /><Distribution /></div>
        </>
      )}

      {(view === 'Dashboard' || !['Approval Queue', 'Rating Overrides', 'HR Submission', 'Reports'].includes(view)) && (
        <>
          <div data-tour="stats" className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Approval Queue" value={queue.length} sub="Awaiting final sign-off" icon={Icon.check} tint="bg-red-100 text-brand" />
            <StatCard label="Approved This Cycle" value={approvedPending} sub="Approved, not yet submitted to HR" icon={Icon.check} tint="bg-emerald-100 text-emerald-600" />
            <StatCard label="Submitted to HR" value={submittedToHR} sub="Sent to HR this cycle" icon={Icon.send} tint="bg-sky-100 text-sky-600" />
            <StatCard label="Rating Overrides" value={3} sub="Pending review" icon={Icon.sliders} tint="bg-amber-100 text-amber-600" />
            <StatCard label="Avg Cycle Rating" value={avg} sub="Org-wide" icon={Icon.chart} tint="bg-indigo-100 text-indigo-600" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <ApprovalQueue />
            <div className="space-y-6"><HRSubmission /><DeptPerformance /><Distribution /></div>
          </div>
        </>
      )}

      {overrideTarget && <OverrideModal employee={overrideTarget} onClose={() => setOverrideTarget(null)} />}
      {openTower && <TowerModal tower={openTower} onClose={() => setOpenTower(null)} />}
      {openOverrideTower && <OverrideTowerModal tower={openOverrideTower} onClose={() => setOpenOverrideTower(null)} />}
    </>
  )
}
