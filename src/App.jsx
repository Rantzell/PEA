import React, { useState } from 'react'
import { StoreProvider, useStore } from './store.jsx'
import { Icon } from './icons.jsx'
import { CYCLE } from './data.js'
import { Mark, Wordmark } from './Logo.jsx'
import { Tour, useTour } from './Tour.jsx'
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
      {!collapsed && (
        <div className="mx-4 mb-4 mt-5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.accent }}>Current Role</div>
          <div className="font-semibold text-white">{active.role}</div>
        </div>
      )}
      {collapsed && <div className="py-4" />}
      <nav data-tour="nav" className="flex-1 space-y-1 px-3">
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

function TopHeader({ config, onHelp }) {
  const { role, setRole, dark, setDark, notify } = useStore()
  return (
    <header className="flex items-center gap-4 bg-ink px-6 py-3 text-white">
      <Wordmark />
      <span className="ml-1 hidden text-lg font-medium text-white/90 md:inline">Performance Evaluation App</span>
      <div className="ml-auto flex items-center gap-3">
        <div data-tour="search" className="relative hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{Icon.search}</span>
          <input placeholder="Search..." className="w-52 rounded-lg border border-white/15 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand" />
        </div>
        <button data-tour="help" onClick={onHelp} title="User manual walkthrough"
          className="rounded-full border border-white/20 p-2 text-white/70 hover:border-brand hover:text-white">
          {Icon.help}
        </button>
        <button data-tour="theme" onClick={() => setDark(!dark)} className="rounded-full border border-white/20 p-2 text-white/70 hover:border-brand hover:text-white">
          {dark ? Icon.sun : Icon.moon}
        </button>
        <div data-tour="role" className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold">MD</div>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold leading-tight">Dominguez, Mythos</div>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="cursor-pointer bg-transparent text-xs text-white/60 outline-none">
              {Object.keys(ROLE_CONFIG).map((r) => <option key={r} className="text-slate-900">{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}

function Breadcrumb({ section, view, config, notify }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">{Icon.home}</span>
        <span className="text-slate-300">›</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{view}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-brand">{CYCLE}</span>
        <button data-tour="cta" onClick={() => notify(`Started: ${config.cta}`)}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {Icon.plus}<span className="hidden sm:inline">{config.cta}</span>
        </button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="flex items-center justify-between bg-brand px-8 py-4 text-white">
      <div>
        <Wordmark size="sm" />
        <div className="mt-1 text-xs text-white/80">Performance Evaluation App v2.1</div>
      </div>
      <div className="text-right text-xs text-white/90">
        <div>© 2026 Seven Seven Global Services Inc.</div>
        <div>All Rights Reserved</div>
      </div>
    </footer>
  )
}

function Shell() {
  const { role, toast, notify } = useStore()
  const config = ROLE_CONFIG[role]
  const [view, setView] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const tour = useTour()
  const active = { role, view }
  const setActive = (a) => setView(a.view)

  // reset to Dashboard when role changes
  React.useEffect(() => { setView('Dashboard') }, [role])

  const View = VIEWS[role]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <TopHeader config={config} onHelp={tour.start} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar config={config} active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Breadcrumb view={view} config={config} notify={notify} />
          <main className="flex-1 overflow-y-auto p-8">
            <View view={view} config={config} setView={setView} />
          </main>
          <Footer />
        </div>
      </div>
      <Tour open={tour.open} onFinish={tour.finish} />
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
