import React from 'react'
import { useStore } from '../store.jsx'
import { Card, StatCard, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { auditLog, syncRuns as seed } from '../data.js'

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
      const id = `sync-0${n}`
      setRuns((r) => [{ id, when: 'Just now · 2m 03s', records: '1,210', status: 'OK' }, ...r])
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

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <Button onClick={triggerSync} disabled={syncing}>
          <span className={syncing ? 'animate-spin' : ''}>{Icon.refresh}</span> {syncing ? 'Syncing…' : 'Trigger Sync'}
        </Button>
      </div>
      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="System Uptime" value="99.9%" sub="Last 30 days" icon={Icon.server} tint="bg-emerald-100 text-emerald-600" />
        <StatCard label="Sync Success Rate" value={`${okRate}%`} sub={`${runs.filter(r=>r.status==='OK').length} of ${runs.length} syncs OK`} icon={Icon.git} tint="bg-amber-100 text-amber-600" />
        <StatCard label="Active Sessions" value="48" sub="Right now" icon={Icon.users} tint="bg-indigo-100 text-indigo-600" />
        <StatCard label="Failed Syncs" value={failed} sub="Requires attention" icon={Icon.x} tint="bg-red-100 text-brand" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
      </div>

      <Card className="mt-6">
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
    </>
  )
}
