import React from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Button, ProgressBar, Badge } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { questionnaires as seed } from '../data.js'

export function HRAdminView({ view }) {
  const { notify } = useStore()
  const [items, setItems] = React.useState(seed)

  const publish = (id) => {
    setItems((list) => list.map((q) => q.id === id ? { ...q, status: 'Published' } : q))
    const q = items.find((x) => x.id === id)
    notify(`Published “${q?.title}”`)
  }
  const publishedCount = items.filter((q) => q.status === 'Published').length
  const draftCount = items.filter((q) => q.status === 'Draft').length

  return (
    <>
      <div data-tour="stats" className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published Questionnaires" value={publishedCount} sub="Active this cycle" icon={Icon.clipboard} tint="bg-emerald-100 text-emerald-600" />
        <StatCard label="Draft Questionnaires" value={draftCount} sub="Pending publish" icon={Icon.edit} tint="bg-amber-100 text-amber-600" />
        <StatCard label="Assignments Sent" value="156" sub="Across all departments" icon={Icon.send} tint="bg-indigo-100 text-indigo-600" />
        <StatCard label="Completion Rate" value="71%" sub="+5% from last cycle" icon={Icon.chart} tint="bg-red-100 text-brand" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" data-tour="main">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Questionnaire Management</h2>
            <Button onClick={() => notify('New questionnaire draft created')}>{Icon.plus} New Questionnaire</Button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((q) => (
              <div key={q.id} className="flex items-center gap-4 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">{Icon.clipboard}</span>
                <div className="flex-1">
                  <div className="font-semibold leading-tight">{q.title}</div>
                  <div className="text-xs text-slate-400">{q.meta}</div>
                </div>
                <div className="hidden w-24 sm:block"><ProgressBar pct={q.progress} color="#10b981" /></div>
                <Badge status={q.status} />
                <Button variant="ghost" onClick={() => notify(`Editing “${q.title}”`)}>{Icon.edit} Edit</Button>
                {q.status === 'Draft' && <Button variant="green" onClick={() => publish(q.id)}>{Icon.download} Publish</Button>}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-bold">Organisation-Wide Statistics</h2>
            <div className="space-y-2">
              {[
                ['Total Employees', 312, Icon.users, 'bg-indigo-50 text-indigo-600'],
                ['Evaluations Initiated', 289, Icon.play, 'bg-blue-50 text-blue-600'],
                ['Awaiting HR Approval', 14, Icon.history, 'bg-amber-50 text-amber-600'],
                ['Fully Completed', 198, Icon.check, 'bg-emerald-50 text-emerald-600'],
              ].map(([label, val, icon, tint]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}>{icon}</span>
                  <span className="font-medium">{label}</span>
                  <span className="ml-auto text-lg font-bold">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold">Reports &amp; Exports</h2>
            <div className="space-y-2">
              {[
                ['Full Evaluation Report', Icon.chart],
                ['Department Summary', Icon.pie],
                ['Ratings Distribution', Icon.hash],
                ['Completion Tracker', Icon.check],
              ].map(([label, icon]) => (
                <button key={label} onClick={() => notify(`Generating: ${label}`)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40">
                  <span className="text-brand">{icon}</span>{label}
                  <span className="ml-auto text-slate-300">{Icon.download}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
