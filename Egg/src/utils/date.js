export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}