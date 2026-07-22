import React from 'react'
import { useStore } from '../store.jsx'
import { Card, Avatar, Badge, ProgressBar, Stars, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { evaluationHistory } from '../data.js'
import { EvaluationModal } from './EvaluationModal.jsx'

function Header({ title, sub, badge, tint }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${tint}`}>⚡ {badge}</span>
    </div>
  )
}

function WelcomeBanner() {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-brand-dark p-8 text-white shadow-lg">
      <div className="text-xs font-bold uppercase tracking-widest text-white/70">Welcome Back</div>
      <div className="mt-1 text-3xl font-extrabold">Sophia Martínez</div>
      <div className="mt-1 text-white/80">Senior Engineer · Engineering Team · Q4 2025 Cycle</div>
      <div className="mt-5 flex gap-4">
        {[['2', 'Pending'], ['1', 'In Progress'], ['3', 'Completed']].map(([n, l]) => (
          <div key={l} className="rounded-xl bg-white/15 px-6 py-3 text-center">
            <div className="text-2xl font-bold">{n}</div>
            <div className="text-xs text-white/80">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResourceView({ view, config, setView }) {
  const { employees, notify } = useStore()
  const [evalTarget, setEvalTarget] = React.useState(null)
  const mine = employees.slice(0, 3)
  const reports = employees.filter((e) => ['lf', 'at', 'rc'].includes(e.id))

  if (view === 'Evaluation History') {
    return (
      <>
        <Header title="Evaluation History" sub="Your performance over past cycles." badge="RESOURCE" tint={config.badgeTint} />
        <div className="grid gap-5 sm:grid-cols-3">
          {evaluationHistory.map((h) => (
            <Card key={h.period} className="text-center">
              <div className="text-sm text-slate-400">{h.period}</div>
              <div className="my-2 text-5xl font-extrabold">{h.score}</div>
              <Stars value={h.score} />
              <div className="mt-3 font-semibold text-emerald-600">{h.label}</div>
            </Card>
          ))}
        </div>
      </>
    )
  }

  if (view === 'My Self Evaluation') {
    return (
      <>
        <Header title="My Self Evaluation" sub="Rate yourself across the Q4 2025 competencies." badge="RESOURCE" tint={config.badgeTint} />
        <Card>
          <p className="mb-4 text-slate-500">Complete your self-assessment before your manager review.</p>
          <Button onClick={() => setEvalTarget(employees[0])}>{Icon.play} Start Self Evaluation</Button>
        </Card>
        {evalTarget && <EvaluationModal employee={evalTarget} onClose={() => setEvalTarget(null)} selfMode />}
      </>
    )
  }

  if (view === 'Direct Reports') {
    return (
      <>
        <Header title="Direct Reports" sub="Evaluate the people who report to you." badge="RESOURCE" tint={config.badgeTint} />
        <Card>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {reports.map((e) => (
              <ReportRow key={e.id} e={e} onEvaluate={() => setEvalTarget(e)} />
            ))}
          </div>
        </Card>
        {evalTarget && <EvaluationModal employee={evalTarget} onClose={() => setEvalTarget(null)} />}
      </>
    )
  }

  // Dashboard
  return (
    <>
      <Header title="My Workspace" sub="Track your evaluations and direct reports in one place." badge="RESOURCE" tint={config.badgeTint} />
      <WelcomeBanner />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">My Evaluations</h2>
            <Button variant="ghost" onClick={() => setView('Direct Reports')}>↗ View All</Button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {mine.map((e) => (
              <div key={e.id} className="flex items-center gap-4 py-4">
                <Avatar initials={e.initials} color={e.color} />
                <div className="w-32">
                  <div className="font-semibold leading-tight">{e.name}</div>
                  <div className="text-xs text-slate-400">{e.dept} · {e.type}</div>
                </div>
                <Badge status={e.status} dot />
                <div className="flex-1"><ProgressBar pct={e.progress} /></div>
                <div className="hidden w-24 text-sm text-slate-400 sm:block">{e.due}</div>
                {e.rating && <Stars value={e.rating} />}
                <Button onClick={() => setEvalTarget(e)}>{Icon.play} {e.status === 'In Progress' ? 'Continue' : 'Start'}</Button>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
          <div className="space-y-3">
            {[
              ['Start Self Evaluation', Icon.clipboard, 'bg-red-50 text-brand', () => setView('My Self Evaluation')],
              ['View Evaluation History', Icon.history, 'bg-indigo-50 text-indigo-600', () => setView('Evaluation History')],
              ['Check Team Progress', Icon.users, 'bg-emerald-50 text-emerald-600', () => setView('Direct Reports')],
              ['Download My Reviews', Icon.download, 'bg-amber-50 text-amber-600', () => notify('Preparing review export…')],
            ].map(([label, icon, tint, fn]) => (
              <button key={label} onClick={fn} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}>{icon}</span>
                {label}<span className="ml-auto text-slate-300">↗</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Direct Reports Requiring Evaluation</h2>
          <Badge status="Needs Re-evaluation" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {reports.map((e) => <ReportRow key={e.id} e={e} onEvaluate={() => setEvalTarget(e)} />)}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 text-lg font-bold">Evaluation History</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {evaluationHistory.map((h) => (
            <div key={h.period} className="rounded-xl bg-slate-50 p-5 text-center dark:bg-slate-700/40">
              <div className="text-sm text-slate-400">{h.period}</div>
              <div className="my-2 text-4xl font-extrabold">{h.score}</div>
              <Stars value={h.score} />
              <div className="mt-2 font-semibold text-emerald-600">{h.label}</div>
            </div>
          ))}
        </div>
      </Card>
      {evalTarget && <EvaluationModal employee={evalTarget} onClose={() => setEvalTarget(null)} />}
    </>
  )
}

function ReportRow({ e, onEvaluate }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <Avatar initials={e.initials} color={e.color} />
      <div className="w-40">
        <div className="font-semibold leading-tight">{e.name}</div>
        <div className="text-xs text-slate-400">{e.dept} · {e.type}</div>
      </div>
      <Badge status={e.status} dot />
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden w-32 sm:block"><ProgressBar pct={e.progress} /></div>
        <div className="hidden w-24 text-sm text-slate-400 md:block">{e.due}</div>
        {e.rating && <Stars value={e.rating} />}
        <Button onClick={onEvaluate}>{Icon.edit} Evaluate</Button>
      </div>
    </div>
  )
}
