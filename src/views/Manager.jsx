import React from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Avatar, Badge, ProgressBar, Stars, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { deptCompletion } from '../data.js'
import { EvaluationModal } from './EvaluationModal.jsx'

function DeptBars() {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold">Team Completion</h2>
      <div className="space-y-4">
        {deptCompletion.map((d) => (
          <div key={d.dept}>
            <div className="mb-1 flex justify-between text-sm font-semibold">
              <span>{d.dept}</span><span>{d.pct}%</span>
            </div>
            <ProgressBar pct={d.pct} color={d.color} />
          </div>
        ))}
      </div>
    </Card>
  )
}

function TopPerformers({ employees }) {
  const top = [...employees].filter((e) => e.rating).sort((a, b) => b.rating - a.rating).slice(0, 2)
  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold">Top Performers</h2>
      <div className="space-y-3">
        {top.map((e, i) => (
          <div key={e.id} className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400">{i + 1}</span>
            <Avatar initials={e.initials} color={e.color} size={36} />
            <div className="font-semibold">{e.name.split(' ')[0]}</div>
            <div className="ml-auto"><Stars value={e.rating} /></div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TeamTable({ employees, onAct, title = 'Team Evaluations' }) {
  const { approve } = useStore()
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button variant="ghost" onClick={() => onAct.export()}>{Icon.download} Export</Button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {employees.map((e) => (
          <div key={e.id} className="flex items-center gap-4 py-4">
            <Avatar initials={e.initials} color={e.color} />
            <div className="w-44">
              <div className="font-semibold leading-tight">{e.name}</div>
              <div className="text-xs text-slate-400">{e.dept} · {e.type}</div>
            </div>
            <Badge status={e.status} dot />
            <div className="ml-auto flex items-center gap-4">
              <div className="hidden w-28 sm:block"><ProgressBar pct={e.progress} /></div>
              <div className="hidden w-24 text-sm text-slate-400 md:block">{e.due}</div>
              {e.rating && <Stars value={e.rating} />}
              {e.status === 'Awaiting Approval'
                ? <Button variant="green" onClick={() => approve(e.id)}>{Icon.thumb} Approve</Button>
                : e.status === 'Needs Re-evaluation'
                ? <Button variant="red" onClick={() => onAct.evaluate(e)}>{Icon.eye} Review</Button>
                : <Button variant="ghost" onClick={() => onAct.evaluate(e)}>{Icon.eye} View</Button>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ManagerView({ view, config }) {
  const { employees, notify } = useStore()
  const [evalTarget, setEvalTarget] = React.useState(null)
  const onAct = { evaluate: setEvalTarget, export: () => notify('Exporting team evaluations…') }
  const attention = employees.filter((e) => ['In Progress', 'Not Started'].includes(e.status)).slice(0, 4)

  const isReports = view === 'Reports'
  const inProgress = employees.filter((e) => e.status === 'In Progress').length
  const pendingApprovals = employees.filter((e) => e.status === 'Awaiting Approval').length
  const overdue = employees.filter((e) => e.status === 'Needs Re-evaluation')
  const rated = employees.filter((e) => e.rating)
  const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : '—'
  const started = employees.filter((e) => e.progress > 0).length

  return (
    <>
      {isReports && (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Manager Dashboard</h1>
              <p className="mt-1 text-slate-500">Oversee your team's performance and drive completion.</p>
            </div>
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.badgeTint}`}>⚡ MANAGER</span>
          </div>
          <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Team Completion Rate" value="64%" sub={`${started}/10 started`} icon={Icon.chart} tint="bg-emerald-100 text-emerald-600" />
            <StatCard label="Pending Approvals" value={pendingApprovals} sub="Action required" icon={Icon.check} tint="bg-red-100 text-brand" />
            <StatCard label="Overdue Reviews" value={overdue.length} sub={overdue[0]?.name || '—'} icon={Icon.history} tint="bg-amber-100 text-amber-600" />
            <StatCard label="Avg Team Rating" value={avg} sub="vs 3.9 last cycle" icon={Icon.chart} tint="bg-indigo-100 text-indigo-600" />
          </div>
        </>
      )}
      {!isReports && (
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight">{view}</h1>
        </div>
      )}

      {view === 'Approvals' && (
        <TeamTable employees={employees.filter((e) => e.status === 'Awaiting Approval' || e.status === 'Approved')} onAct={onAct} title="Pending Approvals" />
      )}

      {view === 'My Evaluations' && (
        <Card>
          <h2 className="mb-1 text-lg font-bold">My Evaluations</h2>
          <p className="mb-4 text-sm text-slate-400">Evaluations assigned to you this cycle.</p>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {employees.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center gap-4 py-4">
                <Avatar initials={e.initials} color={e.color} />
                <div className="w-44"><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.dept} · {e.type}</div></div>
                <Badge status={e.status} dot />
                <div className="ml-auto flex items-center gap-4">
                  <div className="hidden w-28 sm:block"><ProgressBar pct={e.progress} /></div>
                  {e.rating && <Stars value={e.rating} />}
                  <Button onClick={() => setEvalTarget(e)}>{Icon.play} {e.status === 'In Progress' ? 'Continue' : 'Start'}</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === 'My Team' && (
        <TeamTable employees={employees} onAct={onAct} title="My Team" />
      )}

      {view === 'History' && (
        <TeamTable employees={employees.filter((e) => ['Completed', 'Approved'].includes(e.status))} onAct={onAct} title="Evaluation History" />
      )}

      {(view === 'Dashboard' || isReports) && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><TeamTable employees={employees} onAct={onAct} /></div>
          <div className="space-y-6">
            <DeptBars />
            <TopPerformers employees={employees} />
            <Card>
              <h2 className="mb-4 text-lg font-bold">Needs Your Attention</h2>
              <div className="space-y-3">
                {attention.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
                    <Avatar initials={e.initials} color={e.color} size={36} />
                    <div><div className="font-semibold leading-tight">{e.name.split(' ')[0]}</div><div className="text-xs text-slate-400">{e.type}</div></div>
                    <div className="ml-auto"><Badge status={e.status} dot /></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      {evalTarget && <EvaluationModal employee={evalTarget} onClose={() => setEvalTarget(null)} />}
    </>
  )
}
