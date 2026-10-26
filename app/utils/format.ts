const dateFmt = new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso))
}

// yyyy-mm-dd in the visitor's local time zone, `days` from today (for date input `min`).
export function localDateFromToday(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Short human reference for demo form submissions, e.g. "QT-7K3F9A".
export function makeReference(prefix: string) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `${prefix}-${code}`
}
