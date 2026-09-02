export const HENS = [
    { name: 'Augusta', breed: 'Hedemora' },
    { name: 'Beata', breed: 'Hedemora' },
    { name: 'Nallemaja', breed: 'Hedemora' },
    { name: 'Vargen', breed: 'Hedemora' },
    { name: 'Lille Skutt', breed: 'Silveruddsblå' },
    { name: 'Katten Janson', breed: 'Silveruddsblå' },
    { name: 'Skalman', breed: 'Silveruddsblå' },
    { name: 'Brummelisa', breed: 'Svart Maran' },
]

export const UNKNOWN_HEN = 'Okänd'

export const BREED_COLORS = {
    "Hedemora": 'Ljusbrunt',
    "Silveruddsblå": 'Grönt',
    "Svart Maran": 'Mörkbrunt'
}

export function henNames() {
    return HENS.map((h) => h.name)
}

export function getBreed(henName) {
    return HENS.find((h) => h.name === henName)?.breed ?? 'Okänd'
}

export function getBreedColor(breed) {
    return BREED_COLORS[breed] ?? 'Okänd'
}

export function getEggBreedInfo(egg) {
    if (egg.hen === UNKNOWN_HEN) {
        const color = (egg.color || '').trim()
        return { breed: UNKNOWN_HEN, color: color || UNKNOWN_HEN }
    }
    const breed = getBreed(egg.hen)
    return { breed, color: getBreedColor(breed) }
}

export function getBreedByColor(color) {
  const normalized = (color || '').trim().toLowerCase()
  const match = Object.entries(BREED_COLORS).find(
    ([, c]) => c.trim().toLowerCase() === normalized
  )
  return match ? match[0] : null
}