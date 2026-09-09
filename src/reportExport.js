import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const timestamp = () => new Date().toISOString().slice(0, 10)

export function exportReportsToExcel({ stats, accounts, distribution }) {
  const wb = XLSX.utils.book_new()

  const statsSheet = XLSX.utils.json_to_sheet(
    stats.map((s) => ({ Metric: s.label, Value: s.value, Detail: s.sub }))
  )
  XLSX.utils.book_append_sheet(wb, statsSheet, 'Summary')

  const accountsSheet = XLSX.utils.json_to_sheet(
    accounts.map((a) => ({ Account: a.name, Reviews: a.reviews, 'Avg Rating': a.rating }))
  )
  XLSX.utils.book_append_sheet(wb, accountsSheet, 'Account Performance')

  const distSheet = XLSX.utils.json_to_sheet(
    distribution.map((d) => ({ Tier: d.label, Count: d.count }))
  )
  XLSX.utils.book_append_sheet(wb, distSheet, 'Evaluation Distribution')

  XLSX.writeFile(wb, `PEA_Reports_${timestamp()}.xlsx`)
}

export function exportReportsToPDF({ stats, accounts, distribution }) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Tower Head Reports', 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 24)

  autoTable(doc, {
    startY: 30,
    head: [['Metric', 'Value', 'Detail']],
    body: stats.map((s) => [s.label, String(s.value), s.sub]),
    headStyles: { fillColor: [200, 16, 46] },
  })

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Account', 'Reviews', 'Avg Rating']],
    body: accounts.map((a) => [a.name, String(a.reviews), String(a.rating)]),
    headStyles: { fillColor: [200, 16, 46] },
  })

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Tier', 'Count']],
    body: distribution.map((d) => [d.label, String(d.count)]),
    headStyles: { fillColor: [200, 16, 46] },
  })

  doc.save(`PEA_Reports_${timestamp()}.pdf`)
}
