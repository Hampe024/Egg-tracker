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
import { BREED_COLORS, getEggBreedGroup, UNKNOWN_HEN } from '../data/hens'

const MIN_BAR_WIDTH = 20

const RANGES = [
    { id: '7', label: '7 dagar', days: 7 },
    { id: '30', label: '30 dagar', days: 30 },
    { id: '90', label: '90 dagar', days: 90 },
    { id: 'all', label: 'Alla', days: null },
]

function EggCountChart({ eggs }) {
    const [range, setRange] = useState('30')
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

        const countByDate = new Map()
        for (const egg of sortedEggs) {
            if (egg.date < start) continue
            countByDate.set(egg.date, (countByDate.get(egg.date) ?? 0) + 1)
        }

        return eachDateBetween(start, today).map((date) => ({
            date,
            label: formatDate(date),
            count: countByDate.get(date) ?? 0,
        }))
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
                    <option value={UNKNOWN_HEN}>{UNKNOWN_HEN}</option>
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
                                    <Tooltip
                                        labelFormatter={(_, payload) => {
                                            const point = payload?.[0]?.payload
                                            return point ? formatDate(point.date) : ''
                                        }}
                                        formatter={(value) => [`${value} ägg`, 'Antal']}
                                    />
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