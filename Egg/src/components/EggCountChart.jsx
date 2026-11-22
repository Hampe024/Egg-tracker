import { useMemo, useState } from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { eachDateBetween, formatDate, toISODateLocal, todayISO } from '../utils/date'
import { BREED_COLORS, getEggBreedGroup, getBreedByColor, UNKNOWN_HEN } from '../data/hens'

const MIN_BAR_WIDTH = 20

const RANGES = [
    { id: '7', label: '7 dagar', days: 7 },
    { id: '30', label: '30 dagar', days: 30 },
    { id: '90', label: '90 dagar', days: 90 },
    { id: 'all', label: 'Alla', days: null },
]

function eggLabel(egg) {
    const breed = getBreedByColor(egg.color) || UNKNOWN_HEN
    return egg.hen === UNKNOWN_HEN ? `${breed} (${egg.color})` : egg.hen
}

function groupedEntries(eggsList) {
    const counts = new Map()
    for (const egg of eggsList) {
        const label = eggLabel(egg)
        counts.set(label, (counts.get(label) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const point = payload[0].payload
    if (!point || point.count === 0) return null

    const weighted = point.eggs.filter((e) => e.weightGrams != null)
    const weightlessKnown = point.eggs.filter(
        (e) => e.weightGrams == null && e.hen !== UNKNOWN_HEN
    )
    const weightlessUnknown = point.eggs.filter(
        (e) => e.weightGrams == null && e.hen === UNKNOWN_HEN
    )

    // console.log('CustomTooltip', { weighted, weightlessKnown, weightlessUnknown })

    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-title">{formatDate(point.date)}</p>
            
            <ul className="chart-tooltip-list">
                {weighted.map((egg) => (
                    <li key={egg.id}>
                        <span>{eggLabel(egg)}</span>
                        <span>{egg.weightGrams} g</span>
                    </li>
                ))}
                {weightlessKnown.map((egg) => (
                    <li key={egg.id}>
                        <span>{eggLabel(egg)}</span>
                    </li>
                ))}
                {groupedEntries(weightlessUnknown).map(([label, count]) => (
                    <li key={label}>
                        <span>{count}st {label}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function EggCountChart({ eggs }) {
    const [range, setRange] = useState('7')
    const [breed, setBreed] = useState('all')

    const filteredEggs = useMemo(
        () => (breed === 'all' ? eggs : eggs.filter((e) => getEggBreedGroup(e) === breed)),
        [eggs, breed]
    )

    const sortedEggs = useMemo(
        () => [...filteredEggs].sort((a, b) => (a.date > b.date ? 1 : -1)),
        [filteredEggs]
    )

    const chartData = useMemo(() => {
        if (sortedEggs.length === 0) return []

        const today = todayISO()
        const firstDate = sortedEggs[0].date
        const rangeDef = RANGES.find((r) => r.id === range)

        let start = firstDate
        if (rangeDef?.days) {
            const cutoff = new Date(today + 'T00:00:00')
            cutoff.setDate(cutoff.getDate() - (rangeDef.days - 1))
            const cutoffISO = toISODateLocal(cutoff)
            if (cutoffISO > start) start = cutoffISO
        }

        const eggsByDate = new Map()
        for (const egg of sortedEggs) {
            if (egg.date < start) continue
            if (!eggsByDate.has(egg.date)) eggsByDate.set(egg.date, [])
            eggsByDate.get(egg.date).push(egg)
        }

        return eachDateBetween(start, today).map((date) => {
            const dayEggs = eggsByDate.get(date) ?? []
            return {
                date,
                label: formatDate(date),
                count: dayEggs.length,
                eggs: dayEggs,
            }
        })
    }, [sortedEggs, range])

    return (
        <div>
            <div className="chart-controls">
                <div className="field" style={{ maxWidth: 200 }}>
                <label htmlFor="breed-select">Ras</label>
                <select id="breed-select" value={breed} onChange={(e) => setBreed(e.target.value)}>
                    <option value="all">Alla raser</option>
                    {Object.keys(BREED_COLORS).map((b) => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                    {/* <option value={UNKNOWN_HEN}>{UNKNOWN_HEN}</option> */}
                </select>
                </div>
                <div className="field" style={{ maxWidth: 160 }}>
                <label htmlFor="egg-range-select">Period</label>
                <select id="egg-range-select" value={range} onChange={(e) => setRange(e.target.value)}>
                    {RANGES.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                </select>
                </div>
            </div>

            {chartData.length === 0 ? (
                <p className="hint">Inga ägg registrerade för den här perioden.</p>
            ) : (
                <>
                    <p className="chart-axis-label">Antal ägg</p>
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: `${chartData.length * MIN_BAR_WIDTH}px` }}>
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={28} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default EggCountChart