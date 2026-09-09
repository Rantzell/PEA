import React from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Avatar, Badge, ProgressBar, Stars, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { deptCompletion, DEPT_ACCOUNT } from '../data.js'
import { EvaluationModal } from './EvaluationModal.jsx'

const MANAGER_NAME = 'Maria Dela Cruz'

function groupByAccount(employees) {
  return employees.reduce((acc, e) => {
    const account = DEPT_ACCOUNT[e.dept] || e.dept
    ;(acc[account] ||= []).push(e)
    return acc
  }, {})
}

const ACCOUNT_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#c8102e', '#10b981', '#0ea5e9', '#8b5cf6', '#14b8a6', '#f97316']

function AccountDonut({ groups, accounts }) {
  const total = accounts.reduce((a, acc) => a + groups[acc].length, 0) || 1
  let cumulative = 0
  const stops = accounts.map((acc, i) => {
    const color = ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]
    const start = (cumulative / total) * 360
    cumulative += groups[acc].length
    const end = (cumulative / total) * 360
    return `${color} ${start}deg ${end}deg`
  }).join(', ')
  return (
    <div className="mb-5 flex flex-col items-center gap-5 border-b border-slate-100 pb-5 dark:border-slate-700 sm:flex-row">
      <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
        <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-white dark:bg-slate-800">
          <div className="text-xl font-extrabold">{total}</div>
          <div className="text-[10px] text-slate-400">total</div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        {accounts.map((acc, i) => (
          <div key={acc} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ACCOUNT_COLORS[i % ACCOUNT_COLORS.length] }} />
            <span className="truncate text-slate-600 dark:text-slate-300">{acc}</span>
            <span className="ml-auto font-semibold">{groups[acc].length}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountCardGrid({ title, employees, emptyText, tint, onOpen }) {
  const groups = groupByAccount(employees)
  const accounts = Object.keys(groups).sort()
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-sm text-slate-400">{employees.length} total</span>
      </div>
      {accounts.length === 0 && <p className="py-8 text-center text-slate-400">{emptyText}</p>}
      {accounts.length > 0 && <AccountDonut groups={groups} accounts={accounts} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((account) => (
          <button
            key={account}
            onClick={() => onOpen(account)}
            className="rounded-xl border border-slate-100 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg dark:border-slate-700"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}>{Icon.users}</div>
            <div className="font-bold leading-snug">{account}</div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-2xl font-extrabold">{groups[account].length}</span>
              <span className="text-sm text-slate-400">pending</span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}

function DirectReportsAccountModal({ account, employees, onClose, onEvaluate }) {
  const members = employees.filter((e) => (DEPT_ACCOUNT[e.dept] || e.dept) === account)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{account}</h3>
            <p className="text-sm text-slate-400">{members.length} direct reports pending evaluation</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">{Icon.x}</button>
        </div>
        <div className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
          {members.length === 0 && <p className="py-8 text-center text-slate-400">No pending evaluations in this account.</p>}
          {members.map((e) => (
            <div key={e.id} className="flex items-center gap-4 py-4">
              <Avatar initials={e.initials} color={e.color} />
              <div className="w-44"><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.dept} · {e.type}</div></div>
              <Badge status={e.status} dot />
              <div className="ml-auto flex items-center gap-4">
                <div className="hidden w-28 sm:block"><ProgressBar pct={e.progress} /></div>
                <Button onClick={() => onEvaluate(e)}>{Icon.play} {e.status === 'In Progress' ? 'Continue' : 'Start'}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApprovalsAccountModal({ account, employees, onClose, onApprove }) {
  const members = employees.filter((e) => (DEPT_ACCOUNT[e.dept] || e.dept) === account)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{account}</h3>
            <p className="text-sm text-slate-400">{members.length} pending approval</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">{Icon.x}</button>
        </div>
        <div className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
          {members.length === 0 && <p className="py-8 text-center text-slate-400">No pending approvals in this account.</p>}
          {members.map((e) => (
            <div key={e.id} className="flex items-center gap-4 py-4">
              <Avatar initials={e.initials} color={e.color} />
              <div className="w-44"><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.dept} · {e.type}</div></div>
              {e.rating && <Stars value={e.rating} />}
              <div className="ml-auto"><Button variant="green" onClick={() => onApprove(e.id)}>{Icon.thumb} Approve</Button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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

function TeamTable({ employees, onAct, title = 'Team Evaluations', emptyText = 'Nothing here right now.' }) {
  const { approve } = useStore()
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button variant="ghost" onClick={() => onAct.export()}>{Icon.download} Export</Button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {employees.length === 0 && <p className="py-8 text-center text-slate-400">{emptyText}</p>}
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
  const { employees, notify, approve } = useStore()
  const [evalTarget, setEvalTarget] = React.useState(null)
  const [openDirectAccount, setOpenDirectAccount] = React.useState(null)
  const [openApprovalAccount, setOpenApprovalAccount] = React.useState(null)
  const onAct = { evaluate: setEvalTarget, export: () => notify('Exporting team evaluations…') }
  const attention = employees.filter((e) => ['In Progress', 'Not Started'].includes(e.status)).slice(0, 4)

  const isReports = view === 'Reports'
  const inProgress = employees.filter((e) => e.status === 'In Progress').length
  const pendingApprovalsList = employees.filter((e) => e.status === 'Awaiting Approval')
  const pendingDirectReports = employees.filter((e) => ['Not Started', 'In Progress'].includes(e.status))
  const rated = employees.filter((e) => e.rating)
  const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : '—'
  const started = employees.filter((e) => e.progress > 0).length

  const isDashboard = view === 'Dashboard'

  return (
    <>
      {(isDashboard || isReports) && (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{isReports ? 'Manager Dashboard' : MANAGER_NAME}</h1>
              <p className="mt-1 text-slate-500">
                {isReports ? 'Full breakdown of team completion and ratings.' : "Oversee your team's performance and drive completion."}
              </p>
            </div>
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.badgeTint}`}>⚡ MANAGER</span>
          </div>
          <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Team Completion Rate" value={`${Math.round((started / employees.length) * 100)}%`} sub={`${started}/${employees.length} started`} icon={Icon.chart} tint="bg-emerald-100 text-emerald-600" />
            <StatCard label="Pending Direct Reports Evaluation" value={pendingDirectReports.length} sub="Awaiting your evaluation" icon={Icon.clipboard} tint="bg-amber-100 text-amber-600" />
            <StatCard label="Pending Approvals" value={pendingApprovalsList.length} sub="Action required" icon={Icon.check} tint="bg-red-100 text-brand" />
            <StatCard label="Avg Team Rating" value={avg} sub="vs 3.9 last cycle" icon={Icon.chart} tint="bg-indigo-100 text-indigo-600" />
          </div>
        </>
      )}
      {!isDashboard && !isReports && (
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

      {isReports && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><TeamTable employees={employees} onAct={onAct} title="Full Team Report" /></div>
          <div className="space-y-6">
            <DeptBars />
            <TopPerformers employees={employees} />
          </div>
        </div>
      )}

      {isDashboard && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2" data-tour="main">
            <AccountCardGrid
              title="Pending Direct Reports per Account"
              employees={pendingDirectReports}
              emptyText="No direct reports pending evaluation — nice work."
              tint="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
              onOpen={setOpenDirectAccount}
            />
            <AccountCardGrid
              title="Pending Approvals per Account"
              employees={pendingApprovalsList}
              emptyText="No approvals waiting — nice work."
              tint="bg-red-50 text-brand dark:bg-red-900/20"
              onOpen={setOpenApprovalAccount}
            />
            <Card>
              <h2 className="mb-4 text-lg font-bold">Needs Your Attention</h2>
              <div className="space-y-3">
                {attention.length === 0 && <p className="py-4 text-center text-slate-400">Nothing needs attention right now.</p>}
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
          <div className="space-y-6" data-tour="stats">
            <DeptBars />
            <TopPerformers employees={employees} />
          </div>
        </div>
      )}
      {evalTarget && <EvaluationModal employee={evalTarget} onClose={() => setEvalTarget(null)} />}
      {openDirectAccount && (
        <DirectReportsAccountModal
          account={openDirectAccount}
          employees={pendingDirectReports}
          onClose={() => setOpenDirectAccount(null)}
          onEvaluate={(e) => { setOpenDirectAccount(null); setEvalTarget(e) }}
        />
      )}
      {openApprovalAccount && (
        <ApprovalsAccountModal
          account={openApprovalAccount}
          employees={pendingApprovalsList}
          onClose={() => setOpenApprovalAccount(null)}
          onApprove={approve}
        />
      )}
    </>
  )
}
