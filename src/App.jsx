import React, { useState } from 'react'
import { StoreProvider, useStore } from './store.jsx'
import { Icon } from './icons.jsx'
import { CYCLE } from './data.js'
import { ResourceView } from './views/Resource.jsx'
import { ManagerView } from './views/Manager.jsx'
import { TowerHeadView } from './views/TowerHead.jsx'
import { HRAdminView } from './views/HRAdmin.jsx'
import { SystemAdminView } from './views/SystemAdmin.jsx'

const ROLE_CONFIG = {
  Resource: {
    accent: '#c8102e', badge: 'RESOURCE', badgeTint: 'bg-red-50 text-brand',
    cta: 'New Evaluation',
    nav: [
      { id: 'Dashboard', icon: Icon.dashboard },
      { id: 'My Self Evaluation', icon: Icon.clipboard },
      { id: 'Direct Reports', icon: Icon.users },
      { id: 'Evaluation History', icon: Icon.history },
    ],
  },
  Manager: {
    accent: '#2563eb', badge: 'MANAGER', badgeTint: 'bg-blue-50 text-blue-600',
    cta: 'New Evaluation',
    nav: [
      { id: 'Dashboard', icon: Icon.dashboard },
      { id: 'My Evaluations', icon: Icon.clipboard },
      { id: 'My Team', icon: Icon.users },
      { id: 'Approvals', icon: Icon.check },
      { id: 'History', icon: Icon.history },
      { id: 'Reports', icon: Icon.chart },
    ],
  },
  'Tower Head': {
    accent: '#f59e0b', badge: 'TOWER HEAD', badgeTint: 'bg-amber-50 text-amber-600',
    cta: 'New Evaluation',
    nav: [
      { id: 'Dashboard', icon: Icon.dashboard },
      { id: 'Approval Queue', icon: Icon.check },
      { id: 'Rating Overrides', icon: Icon.sliders },
      { id: 'HR Submission', icon: Icon.send },
      { id: 'Reports', icon: Icon.chart },
    ],
  },
  'HR Admin': {
    accent: '#10b981', badge: 'HR ADMIN', badgeTint: 'bg-emerald-50 text-emerald-600',
    cta: 'New Questionnaire',
    nav: [
      { id: 'Dashboard', icon: Icon.dashboard },
      { id: 'Questionnaires', icon: Icon.clipboard },
      { id: 'Assignments', icon: Icon.check },
      { id: 'Employee Directory', icon: Icon.book },
      { id: 'Org Reports', icon: Icon.chart },
      { id: 'Settings', icon: Icon.settings },
    ],
  },
  'System Admin': {
    accent: '#c8102e', badge: 'SYSTEM ADMIN', badgeTint: 'bg-red-50 text-brand',
    cta: 'Trigger Sync',
    nav: [
      { id: 'Dashboard', icon: Icon.dashboard },
      { id: 'System Health', icon: Icon.server },
      { id: 'Salesforce Sync', icon: Icon.git },
      { id: 'Audit Logs', icon: Icon.shield },
      { id: 'User Management', icon: Icon.users },
      { id: 'Settings', icon: Icon.settings },
    ],
  },
}

const VIEWS = {
  Resource: ResourceView,
  Manager: ManagerView,
  'Tower Head': TowerHeadView,
  'HR Admin': HRAdminView,
  'System Admin': SystemAdminView,
}

function Sidebar({ config, active, setActive, collapsed, setCollapsed }) {
  return (
    <aside className={`flex flex-col bg-ink text-slate-300 transition-all ${collapsed ? 'w-20' : 'w-64'} shrink-0`}>
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2l2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.6 8.9l6.5-1z"/></svg>
        </div>
        {!collapsed && <div><div className="font-bold text-white">PEA</div><div className="text-xs text-slate-500">Performance Suite</div></div>}
      </div>
      {!collapsed && (
        <div className="mx-4 mb-4 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.accent }}>Current Role</div>
          <div className="font-semibold text-white">{active.role}</div>
        </div>
      )}
      <nav className="flex-1 space-y-1 px-3">
        {config.nav.map((item) => {
          const on = active.view === item.id
          return (
            <button key={item.id} onClick={() => setActive({ ...active, view: item.id })}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${on ? 'bg-slate-700/60 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              style={on ? { color: config.accent } : {}}>
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.id}</span>}
            </button>
          )
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-white">
        <span className={collapsed ? 'rotate-180' : ''}>‹</span>{!collapsed && 'Collapse'}
      </button>
    </aside>
  )
}

function TopBar({ config, section, cycle }) {
  const { role, setRole, dark, setDark, notify } = useStore()
  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white/70 px-8 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400">{section}</span>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-brand">{cycle}</span>
      </div>
      <div className="relative ml-4 hidden flex-1 max-w-md md:block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icon.search}</span>
        <input placeholder="Search..." className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button onClick={() => notify('No new notifications')} className="relative rounded-full border border-slate-200 p-2 text-slate-500 hover:text-brand dark:border-slate-700">
          {Icon.bell}<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
        </button>
        <button onClick={() => setDark(!dark)} className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-brand dark:border-slate-700">
          {dark ? Icon.sun : Icon.moon}
        </button>
        <select value={role} onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {Object.keys(ROLE_CONFIG).map((r) => <option key={r}>{r}</option>)}
        </select>
        <button onClick={() => notify(`Started: ${config.cta}`)} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {Icon.plus}<span className="hidden sm:inline">{config.cta}</span>
        </button>
      </div>
    </header>
  )
}

function Shell() {
  const { role, toast } = useStore()
  const config = ROLE_CONFIG[role]
  const [view, setView] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const active = { role, view }
  const setActive = (a) => setView(a.view)

  // reset to Dashboard when role changes
  React.useEffect(() => { setView('Dashboard') }, [role])

  const View = VIEWS[role]
  const section = view === 'Reports' || view === 'Org Reports' ? 'REPORTS' : 'DASHBOARD'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Sidebar config={config} active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar config={config} section={section} cycle={CYCLE} />
        <main className="flex-1 overflow-y-auto p-8">
          <View view={view} config={config} setView={setView} />
        </main>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
