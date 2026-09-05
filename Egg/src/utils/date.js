function toISODateLocal(d) {
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

export function todayISO() {
  	return toISODateLocal(new Date())
}

export function formatDate(iso) {
	const d = new Date(iso + 'T00:00:00')
	return Number.isNaN(d.getTime())
		? iso
		: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function eachDateBetween(startISO, endISO) {
    const dates = []
    const current = new Date(startISO + 'T00:00:00')
    const end = new Date(endISO + 'T00:00:00')
    while (current <= end) {
		dates.push(toISODateLocal(current))
		current.setDate(current.getDate() + 1)
    }
    return dates
}

export { toISODateLocal }