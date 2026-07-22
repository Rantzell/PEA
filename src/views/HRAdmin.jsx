import React from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Button, ProgressBar, Badge, Avatar } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { questionnaires as seed } from '../data.js'

const QUESTIONNAIRE_ROWS = [
  { name: 'Self', version: 1, type: 'Self', tower: 'N/A', employment: 'N/A', default: true, published: true },
  { name: 'PEA TEST', version: 1, type: 'Self', tower: 'N/A', employment: 'N/A', default: false, published: true },
  { name: 'HR Questionnaire', version: 1, type: 'Self', tower: 'Human Resources', employment: 'Regular', default: false, published: true },
  { name: 'Peer', version: 1, type: 'Peer', tower: 'N/A', employment: 'N/A', default: true, published: true },
  { name: 'Direct Report', version: 1, type: 'Direct Report', tower: 'N/A', employment: 'N/A', default: true, published: true },
  { name: '360 Evaluation', version: 1, type: 'Eval360', tower: 'N/A', employment: 'N/A', default: true, published: true },
  { name: 'Regularization', version: 1, type: 'Regularization', tower: 'N/A', employment: 'N/A', default: true, published: true },
]

const ASSIGNMENTS = [
  { group: 'Human Resources-Montealto', lead: 'Rodisendo Sevilla Montealto', year: 2025, questionnaire: 'HR Questionnaire', type: 'Self' },
]

const DIRECTORY = [
  { id: '02-0051', name: 'Dematera, Marlon Balute', dept: 'Engineering', initials: 'MD', color: '#6366f1' },
  { id: '02-0228', name: 'Dominguez, Hector Santos', dept: 'Product', initials: 'HD', color: '#ec4899' },
  { id: '03-0080', name: 'Mata, Tweenie Ann Arrieta', dept: 'Design', initials: 'TM', color: '#f59e0b' },
  { id: '04-0003', name: 'Abastillas, Peter John A.', dept: 'Sales', initials: 'PA', color: '#10b981' },
  { id: '04-0139', name: 'Carlos, Ronald Manlapaz', dept: 'Finance', initials: 'RC', color: '#3b82f6' },
  { id: '05-0216', name: 'Villanueva, Mary Catherine Castro', dept: 'Human Resources', initials: 'MV', color: '#8b5cf6' },
  { id: '05-0243', name: 'Espiritu, Oliver Zumel', dept: 'Engineering', initials: 'OE', color: '#0ea5e9' },
  { id: '06-0033', name: 'Mendez, Alvin Zurita', dept: 'Marketing', initials: 'AM', color: '#f97316' },
]

function Th({ children, className = '' }) {
  return <th className={`bg-ink px-4 py-3 text-left text-sm font-semibold text-white first:rounded-l-lg last:rounded-r-lg ${className}`}>{children}</th>
}

export function HRAdminView({ view }) {
  const { notify } = useStore()
  const [items, setItems] = React.useState(seed)
  const [qSearch, setQSearch] = React.useState('')
  const [dSearch, setDSearch] = React.useState('')

  const publish = (id) => {
    setItems((list) => list.map((q) => q.id === id ? { ...q, status: 'Published' } : q))
    const q = items.find((x) => x.id === id)
    notify(`Published “${q?.title}”`)
  }
  const publishedCount = items.filter((q) => q.status === 'Published').length
  const draftCount = items.filter((q) => q.status === 'Draft').length

  const Title = ({ children, sub }) => (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{children}</h1>
      {sub && <p className="mt-1 text-slate-500">{sub}</p>}
    </div>
  )

  // ---- Questionnaires ----
  if (view === 'Questionnaires') {
    const rows = QUESTIONNAIRE_ROWS.filter((r) => r.name.toLowerCase().includes(qSearch.toLowerCase()))
    return (
      <>
        <Title>Questionnaires List</Title>
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <input value={qSearch} onChange={(e) => setQSearch(e.target.value)} placeholder="Search by Questionnaire Name"
              className="w-72 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900" />
            <Button onClick={() => notify('New questionnaire draft created')}>{Icon.plus} Add New Questionnaire</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-1">
              <thead><tr>
                <Th>Name</Th><Th>Version</Th><Th>Evaluation Type</Th><Th>Tower</Th><Th>Employment Type</Th><Th>Default</Th><Th>Published</Th><Th>Action</Th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="bg-slate-50 dark:bg-slate-700/40">
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3">{r.version}</td>
                    <td className="px-4 py-3">{r.type}</td>
                    <td className={`px-4 py-3 ${r.tower === 'N/A' ? 'italic text-slate-400' : ''}`}>{r.tower}</td>
                    <td className={`px-4 py-3 ${r.employment === 'N/A' ? 'italic text-slate-400' : ''}`}>{r.employment}</td>
                    <td className="px-4 py-3">{r.default ? <span className="text-emerald-600">✔</span> : <span className="text-red-500">✘</span>}</td>
                    <td className="px-4 py-3">{r.published ? <span className="text-emerald-600">✔</span> : <span className="text-red-500">✘</span>}</td>
                    <td className="px-4 py-3"><button onClick={() => notify(`Viewing ${r.name}`)} className="text-emerald-600 hover:text-emerald-700">{Icon.eye}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </>
    )
  }

  // ---- Assignments ----
  if (view === 'Assignments') {
    return (
      <>
        <Title>Assigned Questionnaires</Title>
        <Card>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => notify('Assign questionnaire dialog')}>{Icon.plus} Assign Questionnaires</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-1">
              <thead><tr>
                <Th>Group Name</Th><Th>Group Lead</Th><Th>Fiscal Year</Th><Th>Questionnaire Name</Th><Th>Evaluation Type</Th><Th>Actions</Th>
              </tr></thead>
              <tbody>
                {ASSIGNMENTS.map((a) => (
                  <tr key={a.group} className="bg-slate-50 dark:bg-slate-700/40">
                    <td className="px-4 py-3 font-semibold">{a.group}</td>
                    <td className="px-4 py-3">{a.lead}</td>
                    <td className="px-4 py-3">{a.year}</td>
                    <td className="px-4 py-3">{a.questionnaire}</td>
                    <td className="px-4 py-3">{a.type}</td>
                    <td className="px-4 py-3"><button onClick={() => notify(`Removed assignment for ${a.group}`)} className="text-red-500 hover:text-red-600">{Icon.trash}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </>
    )
  }

  // ---- Employee Directory ----
  if (view === 'Employee Directory') {
    const rows = DIRECTORY.filter((e) => `${e.name} ${e.id}`.toLowerCase().includes(dSearch.toLowerCase()))
    return (
      <>
        <Title sub="All employees across the organisation.">Employee Directory</Title>
        <Card>
          <input value={dSearch} onChange={(e) => setDSearch(e.target.value)} placeholder="Search by name or ID…"
            className="mb-4 w-72 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900" />
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {rows.map((e) => (
              <div key={e.id} className="flex items-center gap-4 py-3">
                <Avatar initials={e.initials} color={e.color} size={40} />
                <div className="flex-1"><div className="font-semibold leading-tight">{e.name}</div><div className="text-xs text-slate-400">{e.id} · {e.dept}</div></div>
                <Button variant="ghost" onClick={() => notify(`Viewing ${e.name}`)}>{Icon.eye} View</Button>
              </div>
            ))}
            {rows.length === 0 && <p className="py-8 text-center text-slate-400">No employees found.</p>}
          </div>
        </Card>
      </>
    )
  }

  // ---- Org Reports ----
  if (view === 'Org Reports') {
    return (
      <>
        <Title sub="Download organisation-wide reports and exports.">Org Reports</Title>
        <div data-tour="stats" className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Employees" value="312" icon={Icon.users} tint="bg-indigo-100 text-indigo-600" />
          <StatCard label="Evaluations Initiated" value="289" icon={Icon.play} tint="bg-blue-100 text-blue-600" />
          <StatCard label="Awaiting HR Approval" value="14" icon={Icon.history} tint="bg-amber-100 text-amber-600" />
          <StatCard label="Fully Completed" value="198" icon={Icon.check} tint="bg-emerald-100 text-emerald-600" />
        </div>
        <Card>
          <h2 className="mb-4 text-lg font-bold">Reports &amp; Exports</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[['Full Evaluation Report', Icon.chart], ['Department Summary', Icon.pie], ['Ratings Distribution', Icon.hash], ['Completion Tracker', Icon.check]].map(([label, icon]) => (
              <button key={label} onClick={() => notify(`Generating: ${label}`)}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40">
                <span className="text-brand">{icon}</span>{label}<span className="ml-auto text-slate-300">{Icon.download}</span>
              </button>
            ))}
          </div>
        </Card>
      </>
    )
  }

  // ---- Settings ----
  if (view === 'Settings') {
    return (
      <>
        <Title sub="Configure the evaluation cycle and defaults.">Settings</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-lg font-bold">Cycle Configuration</h2>
            <div className="space-y-3 text-sm">
              {[['Active cycle', 'Q4 2025'], ['Fiscal year', '2026'], ['Default questionnaire', 'Self'], ['Self-eval deadline', 'Dec 25, 2025']].map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/40">
                  <span className="text-slate-500">{k}</span><span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={() => notify('Settings saved')}>{Icon.check} Save Changes</Button>
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-bold">Notifications</h2>
            <p className="text-sm text-slate-500">Reminder emails are sent to employees with incomplete evaluations every Monday at 09:00.</p>
            <Button variant="ghost" className="mt-4" onClick={() => notify('Reminder sent to 114 employees')}>{Icon.send} Send reminders now</Button>
          </Card>
        </div>
      </>
    )
  }

  // ---- Dashboard (default) ----
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
