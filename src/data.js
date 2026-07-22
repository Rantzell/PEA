// Seed data for the PEA Performance Suite. Acts as an in-memory store.
export const ROLES = ['Resource', 'Manager', 'Tower Head', 'HR Admin', 'System Admin']

export const CYCLE = 'Q4 2025'

export const initialEmployees = [
  { id: 'sm', name: 'Sophia Martínez', initials: 'SM', color: '#6366f1', dept: 'Engineering', type: 'Annual Review', status: 'In Progress', progress: 65, due: 'Dec 20, 2025', rating: null },
  { id: 'jo', name: 'James Okonkwo', initials: 'JO', color: '#7c3aed', dept: 'Design', type: 'Mid-Year Check', status: 'Awaiting Approval', progress: 100, due: 'Dec 15, 2025', rating: 4.2 },
  { id: 'ps', name: 'Priya Sharma', initials: 'PS', color: '#ec4899', dept: 'Product', type: 'Annual Review', status: 'Completed', progress: 100, due: 'Nov 30, 2025', rating: 4.7 },
  { id: 'lf', name: 'Lucas Fontaine', initials: 'LF', color: '#f59e0b', dept: 'Sales', type: 'Probation Review', status: 'Needs Re-evaluation', progress: 80, due: 'Dec 10, 2025', rating: 2.8 },
  { id: 'at', name: 'Aiko Tanaka', initials: 'AT', color: '#10b981', dept: 'Marketing', type: 'Self-Evaluation', status: 'Not Started', progress: 0, due: 'Dec 25, 2025', rating: null },
  { id: 'rc', name: 'Rafael Costa', initials: 'RC', color: '#3b82f6', dept: 'Engineering', type: 'Annual Review', status: 'Awaiting Review', progress: 90, due: 'Dec 18, 2025', rating: null },
  { id: 'el', name: 'Emma Larsson', initials: 'EL', color: '#14b8a6', dept: 'Finance', type: 'Mid-Year Check', status: 'In Progress', progress: 45, due: 'Dec 22, 2025', rating: null },
  { id: 'dk', name: 'David Kim', initials: 'DK', color: '#f97316', dept: 'Engineering', type: 'Annual Review', status: 'Completed', progress: 100, due: 'Nov 28, 2025', rating: 4.5 },
  { id: 'nj', name: 'Naomi Johnson', initials: 'NJ', color: '#8b5cf6', dept: 'Legal', type: 'Annual Review', status: 'Awaiting Approval', progress: 100, due: 'Dec 12, 2025', rating: 3.9 },
  { id: 'cw', name: 'Chen Wei', initials: 'CW', color: '#0ea5e9', dept: 'Finance', type: 'Annual Review', status: 'In Progress', progress: 30, due: 'Dec 20, 2025', rating: null },
]

export const deptCompletion = [
  { dept: 'Engineering', pct: 72, color: '#6366f1' },
  { dept: 'Design', pct: 90, color: '#ec4899' },
  { dept: 'Product', pct: 55, color: '#f59e0b' },
  { dept: 'Sales', pct: 40, color: '#c8102e' },
  { dept: 'Finance', pct: 60, color: '#10b981' },
]

export const evaluationHistory = [
  { period: '2024 Q4', score: 4.3, label: 'Excellent' },
  { period: '2024 Q2', score: 4.1, label: 'Excellent' },
  { period: '2023 Q4', score: 3.8, label: 'Good' },
]

export const auditLog = [
  { user: 'hr.admin@corp.com', action: 'Published questionnaire', target: 'Annual Review 2025', time: '10m ago' },
  { user: 'tower@corp.com', action: 'Approved evaluation', target: 'James Okonkwo', time: '2h ago' },
  { user: 'manager@corp.com', action: 'Modified rating', target: 'Lucas Fontaine', time: '5h ago' },
  { user: 'sys.admin@corp.com', action: 'Triggered Salesforce sync', target: 'Full org', time: '1d ago' },
]

export const syncRuns = [
  { id: 'sync-042', when: 'Today 09:15 · 2m 14s', records: '1,204', status: 'OK' },
  { id: 'sync-041', when: 'Yesterday 09:12 · 2m 08s', records: '1,198', status: 'OK' },
  { id: 'sync-040', when: '2 days ago · —', records: null, status: 'Failed' },
  { id: 'sync-039', when: '3 days ago · 2m 21s', records: '1,195', status: 'OK' },
]

export const questionnaires = [
  { id: 'q1', title: 'Annual Performance Review 2025', meta: '98/120 completed · Annual', progress: 82, status: 'Published' },
  { id: 'q2', title: 'Mid-Year Check-In — Engineering', meta: '18/24 completed · Mid-Year', progress: 75, status: 'Published' },
  { id: 'q3', title: 'Probation 90-Day Review', meta: '5/8 completed · Probation', progress: 63, status: 'Published' },
  { id: 'q4', title: 'Self-Assessment Template v3', meta: 'Draft — not assigned · Self-Eval', progress: 0, status: 'Draft' },
  { id: 'q5', title: '360-Degree Peer Feedback', meta: 'Draft — not assigned · 360°', progress: 0, status: 'Draft' },
]

export const evaluationQuestions = [
  { id: 'goals', label: 'Goal Achievement', hint: 'Delivered committed objectives this cycle' },
  { id: 'quality', label: 'Quality of Work', hint: 'Craftsmanship, accuracy, attention to detail' },
  { id: 'collab', label: 'Collaboration', hint: 'Teamwork, communication, knowledge sharing' },
  { id: 'growth', label: 'Growth & Learning', hint: 'Skill development and adaptability' },
  { id: 'leadership', label: 'Leadership & Initiative', hint: 'Ownership and driving outcomes' },
]
