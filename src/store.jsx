import React, { createContext, useContext, useState, useEffect } from 'react'
import { initialEmployees } from './data.js'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('pea-role') || 'Resource')
  const [dark, setDark] = useState(() => localStorage.getItem('pea-dark') === '1')
  const [employees, setEmployees] = useState(initialEmployees)
  const [toast, setToast] = useState(null)

  useEffect(() => { localStorage.setItem('pea-role', role) }, [role])
  useEffect(() => {
    localStorage.setItem('pea-dark', dark ? '1' : '0')
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  const updateEmployee = (id, patch) =>
    setEmployees((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  const approve = (id) => {
    updateEmployee(id, { status: 'Approved' })
    const e = employees.find((x) => x.id === id)
    notify(`Approved evaluation for ${e?.name}`)
  }
  const reject = (id) => {
    updateEmployee(id, { status: 'Needs Re-evaluation' })
    const e = employees.find((x) => x.id === id)
    notify(`Sent back for re-evaluation: ${e?.name}`)
  }
  const override = (id, rating) => {
    updateEmployee(id, { rating, status: 'Approved' })
    const e = employees.find((x) => x.id === id)
    notify(`Overrode rating for ${e?.name} → ${rating.toFixed(1)}`)
  }
  const saveEvaluation = (id, rating, progress = 100) => {
    updateEmployee(id, { rating, progress, status: 'Awaiting Approval' })
    const e = employees.find((x) => x.id === id)
    notify(`Saved evaluation for ${e?.name} (${rating.toFixed(1)})`)
  }

  const value = {
    role, setRole, dark, setDark,
    employees, updateEmployee,
    approve, reject, override, saveEvaluation,
    toast, notify,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
