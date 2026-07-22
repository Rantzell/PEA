import React from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Button, Avatar, Badge } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { auditLog } from '../data.js'
import { syncRuns as seed } from '../data.js'

const USERS = [
  { id: 'md', name: 'Dominguez, Mythos', initials: 'MD', color: '#c8102e', email: 'm.dominguez@corp.com', role: 'System Admin', status: 'Active' },
  { id: 'ha', name: 'HR Administrator', initials: 'HA', color: '#10b981', email: 'hr.admin@corp.com', role: 'HR Admin', status: 'Active' },
  { id: 'tw', name: 'Tower Lead', initials: 'TW', color: '#f59e0b', email: 'tower@corp.com', role: 'Tower Head', status: 'Active' },
  { id: 'mg', name: 'Team Manager', initials: 'MG', color: '#2563eb', email: 'manager@corp.com', role: 'Manager', status: 'Active' },
  { id: 'sm', name: 'Sophia Martínez', initials: 'SM', color: '#6366f1', email: 's.martinez@corp.com', role: 'Resource', status: 'Active' },
  { id: 'lf', name: 'Lucas Fontaine', initials: 'LF', color: '#7c3aed', email: 'l.fontaine@corp.com', role: 'Resource', status: 'Suspended' },
]

function HealthCard() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">System Health</h2>
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          ['API Response', '142ms', Icon.server, 'text-emerald-600'],
          ['Database', '99.9%', Icon.server, 'text-emerald-600'],
          ['Auth Service', '100%', Icon.shield, 'text-emerald-600'],
          ['Salesforce Adapter', 'Slow', Icon.git, 'text-amber-600'],
          ['Email Service', 'Active', Icon.send, 'text-emerald-600'],
          ['Background Jobs', '12 running', Icon.settings, 'text-slate-500'],
        ].map(([label, val, icon, tint]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <span className={`${tint}`}>{icon}</span>
            <div className="mt-2 text-sm font-semibold">{label}</div>
            <div className={`text-sm ${tint}`}>{val}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function SyncCard({ runs, triggerSync, retry, syncing }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Salesforce Synchronization</h2>
        <Button onClick={triggerSync} disabled={syncing}>{Icon.refresh} Trigger Sync</Button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {runs.map((r) => (
          <div key={r.id} className="flex items-center gap-3 py-3">
            <span className={r.status === 'OK' ? 'text-emerald-500' : 'text-red-500'}>{r.status === 'OK' ? Icon.check : Icon.x}</span>
            <div><div className="font-semibold">{r.id}</div><div className="text-xs text-slate-400">{r.when}</div></div>
            <div className="ml-auto flex items-center gap-3">
              {r.records && <span className="text-sm text-slate-400">{r.records} records</span>}
              {r.status === 'OK'
                ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">OK</span>
                : <>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">Failed</span>
                    <Button variant="red" onClick={() => retry(r.id)}>{Icon.refresh} Retry</Button>
                  </>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AuditCard({ notify }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Audit Log</h2>
        <Button variant="ghost" onClick={() => notify('Exporting audit log…')}>{Icon.download} Export Log</Button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {auditLog.map((a, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-brand">{Icon.shield}</span>
            <span className="w-52 font-semibold text-brand">{a.user}</span>
            <span className="flex-1 text-slate-600 dark:text-slate-300">{a.action}</span>
            <span className="hidden text-slate-400 md:block">{a.target}</span>
            <span className="ml-4 text-sm text-slate-400">{a.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function UserManagement({ notify }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">User Management</h2>
        <Button onClick={() => notify('Invite user dialog')}>{Icon.plus} Add User</Button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {USERS.map((u) => (
          <div key={u.id} className="flex items-center gap-4 py-3">
            <Avatar initials={u.initials} color={u.color} size={40} />
            <div className="w-52"><div className="font-semibold leading-tight">{u.name}</div><div className="text-xs text-slate-400">{u.email}</div></div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{u.role}</span>
            <div className="ml-auto flex items-center gap-3">
              <Badge status={u.status === 'Active' ? 'Approved' : 'Rejected'} />
              <Button variant="ghost" onClick={() => notify(`Editing ${u.name}`)}>{Icon.edit} Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Settings({ notify }) {
  const { dark, setDark } = useStore()
  const [autoSync, setAutoSync] = React.useState(true)
  const [notifs, setNotifs] = React.useState(true)
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className={`h-6 w-11 rounded-full p-0.5 transition ${on ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <span className={`block h-5 w-5 rounded-full bg-white transition ${on ? 'translate-x-5' : ''}`} />
    </button>
  )
  const rows = [
    ['Dark mode', 'Use a dark theme across the app', dark, () => setDark(!dark)],
    ['Nightly Salesforce sync', 'Automatically sync records at 02:00', autoSync, () => setAutoSync(!autoSync)],
    ['Email notifications', 'Send digest emails to admins', notifs, () => setNotifs(!notifs)],
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-lg font-bold">System Settings</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {rows.map(([label, hint, on, onClick]) => (
            <div key={label} className="flex items-center gap-4 py-4">
              <div><div className="font-semibold">{label}</div><div className="text-xs text-slate-400">{hint}</div></div>
              <div className="ml-auto"><Toggle on={on} onClick={onClick} /></div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-bold">Environment</h2>
        <div className="space-y-2 text-sm">
          {[['App version', 'v2.1'], ['Environment', 'Production'], ['Region', 'ap-southeast-1'], ['Last deploy', 'Jul 20, 2026']].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/40">
              <span className="text-slate-500">{k}</span><span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => notify('Settings saved')}>{Icon.check} Save Changes</Button>
      </Card>
    </div>
  )
}

export function SystemAdminView({ view }) {
  const { notify } = useStore()
  const [runs, setRuns] = React.useState(seed)
  const [syncing, setSyncing] = React.useState(false)

  const triggerSync = () => {
    if (syncing) return
    setSyncing(true)
    notify('Salesforce sync started…')
    setTimeout(() => {
      const n = runs.length + 43
      setRuns((r) => [{ id: `sync-0${n}`, when: 'Just now · 2m 03s', records: '1,210', status: 'OK' }, ...r])
      setSyncing(false)
      notify('Sync completed · 1,210 records')
    }, 1500)
  }
  const retry = (id) => {
    setRuns((r) => r.map((x) => x.id === id ? { ...x, status: 'OK', records: '1,201', when: 'Just now · 2m 05s' } : x))
    notify(`${id} retried successfully`)
  }
  const failed = runs.filter((r) => r.status === 'Failed').length
  const okRate = Math.round((runs.filter((r) => r.status === 'OK').length / runs.length) * 100)

  const Title = ({ children }) => <h1 className="mb-6 text-3xl font-extrabold tracking-tight">{children}</h1>

  if (view === 'System Health') {
    return (<><Title>System Health</Title>
      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="System Uptime" value="99.9%" sub="Last 30 days" icon={Icon.server} tint="bg-emerald-100 text-emerald-600" />
        <StatCard label="API Response" value="142ms" sub="Avg latency" icon={Icon.server} tint="bg-indigo-100 text-indigo-600" />
        <StatCard label="Active Sessions" value="48" sub="Right now" icon={Icon.users} tint="bg-amber-100 text-amber-600" />
        <StatCard label="Background Jobs" value="12" sub="Running" icon={Icon.settings} tint="bg-slate-100 text-slate-600" />
      </div>
      <HealthCard /></>)
  }
  if (view === 'Salesforce Sync') {
    return (<><Title>Salesforce Sync</Title>
      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        <StatCard label="Sync Success Rate" value={`${okRate}%`} sub={`${runs.filter(r=>r.status==='OK').length} of ${runs.length} OK`} icon={Icon.git} tint="bg-amber-100 text-amber-600" />
        <StatCard label="Failed Syncs" value={failed} sub="Requires attention" icon={Icon.x} tint="bg-red-100 text-brand" />
        <StatCard label="Last Sync" value={runs[0]?.records || '—'} sub="records" icon={Icon.refresh} tint="bg-emerald-100 text-emerald-600" />
      </div>
      <SyncCard runs={runs} triggerSync={triggerSync} retry={retry} syncing={syncing} /></>)
  }
  if (view === 'Audit Logs') {
    return (<><Title>Audit Logs</Title><AuditCard notify={notify} /></>)
  }
  if (view === 'User Management') {
    return (<><Title>User Management</Title><UserManagement notify={notify} /></>)
  }
  if (view === 'Settings') {
    return (<><Title>Settings</Title><Settings notify={notify} /></>)
  }

  // Dashboard — full overview
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <Button onClick={triggerSync} disabled={syncing}>
          <span className={syncing ? 'animate-spin' : ''}>{Icon.refresh}</span> {syncing ? 'Syncing…' : 'Trigger Sync'}
        </Button>
      </div>
      <div data-tour="stats" className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="System Uptime" value="99.9%" sub="Last 30 days" icon={Icon.server} tint="bg-emerald-100 text-emerald-600" />
        <StatCard label="Sync Success Rate" value={`${okRate}%`} sub={`${runs.filter(r=>r.status==='OK').length} of ${runs.length} syncs OK`} icon={Icon.git} tint="bg-amber-100 text-amber-600" />
        <StatCard label="Active Sessions" value="48" sub="Right now" icon={Icon.users} tint="bg-indigo-100 text-indigo-600" />
        <StatCard label="Failed Syncs" value={failed} sub="Requires attention" icon={Icon.x} tint="bg-red-100 text-brand" />
      </div>
      <div data-tour="main" className="grid gap-6 lg:grid-cols-2">
        <HealthCard />
        <SyncCard runs={runs} triggerSync={triggerSync} retry={retry} syncing={syncing} />
      </div>
      <div className="mt-6"><AuditCard notify={notify} /></div>
    </>
  )
}
