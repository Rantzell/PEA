import React, { useState } from 'react'
import { useStore } from '../store.jsx'
import { Avatar, Button } from '../ui.jsx'
import { Icon } from '../icons.jsx'
import { evaluationQuestions } from '../data.js'

export function EvaluationModal({ employee, onClose, selfMode = false }) {
  const { saveEvaluation } = useStore()
  const [scores, setScores] = useState(() =>
    Object.fromEntries(evaluationQuestions.map((q) => [q.id, 0])))
  const [comment, setComment] = useState('')

  const set = (id, v) => setScores((s) => ({ ...s, [id]: v }))
  const rated = Object.values(scores).filter((v) => v > 0)
  const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0
  const complete = rated.length === evaluationQuestions.length

  const submit = () => {
    saveEvaluation(employee.id, Math.round(avg * 10) / 10)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center gap-3">
          <Avatar initials={employee.initials} color={employee.color} />
          <div className="flex-1">
            <div className="text-lg font-bold">{selfMode ? 'Self Evaluation' : employee.name}</div>
            <div className="text-sm text-slate-400">{employee.dept} · {employee.type}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">{Icon.x}</button>
        </div>

        <div className="space-y-4">
          {evaluationQuestions.map((q) => (
            <div key={q.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{q.label}</div>
                  <div className="text-xs text-slate-400">{q.hint}</div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => set(q.id, n)}
                      className={`text-2xl leading-none transition ${n <= scores[q.id] ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'}`}>★</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
            placeholder="Add written feedback…"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900" />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Overall: <span className="text-lg font-bold text-slate-900 dark:text-white">{avg ? avg.toFixed(1) : '—'}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={submit} disabled={!complete} className={!complete ? 'opacity-40 cursor-not-allowed' : ''}>
              {Icon.check} Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
