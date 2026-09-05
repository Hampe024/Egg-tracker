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
import { getEggBreedInfo, henNames, UNKNOWN_HEN } from '../data/hens'

const MIN_BAR_WIDTH = 20

const RANGES = [
    { id: '7', label: '7 dagar', days: 7 },
    { id: '30', label: '30 dagar', days: 30 },
    { id: '90', label: '90 dagar', days: 90 },
    { id: 'all', label: 'Alla', days: null },
]

function HenChart({ eggs }) {
const hens = useMemo(() => [...henNames(), UNKNOWN_HEN], [])
const [selectedHen, setSelectedHen] = useState(hens[0] ?? '')
const [range, setRange] = useState('30')
const activeHen = hens.includes(selectedHen) ? selectedHen : hens[0] ?? ''

const henEggs = useMemo(
    () => eggs.filter((e) => e.hen === activeHen).sort((a, b) => (a.date > b.date ? 1 : -1)),
    [eggs, activeHen]
)

const chartData = useMemo(() => {
    if (henEggs.length === 0) return []

    const today = todayISO()
    const firstEggDate = henEggs[0].date
    const rangeDef = RANGES.find((r) => r.id === range)

    let start = firstEggDate
    if (rangeDef?.days) {
        const cutoff = new Date(today + 'T00:00:00')
        cutoff.setDate(cutoff.getDate() - (rangeDef.days - 1))
        const cutoffISO = toISODateLocal(cutoff)
        if (cutoffISO > start) start = cutoffISO
    }

    const byDate = new Map()
    for (const egg of henEggs) {
        if (egg.date < start) continue
        const entry = byDate.get(egg.date) ?? { sum: 0, count: 0 }
        entry.sum += egg.weightGrams
        entry.count += 1
        byDate.set(egg.date, entry)
    }

    return eachDateBetween(start, today).map((date) => {
        const entry = byDate.get(date)
        return {
            date,
            label: formatDate(date),
            weightGrams: entry ? Math.round((entry.sum / entry.count) * 10) / 10 : undefined,
            eggCount: entry?.count ?? 0,
        }
    })
}, [henEggs, range])

return (
    <div>
        <div className="chart-controls">
            <div className="field" style={{ maxWidth: 240 }}>
            <label htmlFor="hen-select">Höna</label>
            <select id="hen-select" value={activeHen} onChange={(e) => setSelectedHen(e.target.value)}>
                {hens.map((hen) => (
                <option key={hen} value={hen}>{hen}</option>
                ))}
            </select>
            </div>
            <div className="field" style={{ maxWidth: 160 }}>
            <label htmlFor="range-select">Period</label>
            <select id="range-select" value={range} onChange={(e) => setRange(e.target.value)}>
                {RANGES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
                ))}
            </select>
            </div>
        </div>

        {chartData.length === 0 ? (
            <p className="hint">{activeHen} har inga ägg registrerade.</p>
        ) : (
            <div style={{ overflowX: 'auto' }}>
                <p className="chart-axis-label">Vikt (gram)</p>
                <div style={{ minWidth: `${chartData.length * MIN_BAR_WIDTH}px` }}>
                    <ResponsiveContainer width="100%" height={340}>
                        <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                            <YAxis
                                domain={[20, 80]}
                                tick={{ fontSize: 12 }}
                                width={28}
                            />
                            <Tooltip
                            labelFormatter={(_, payload) => {
                                const point = payload?.[0]?.payload
                                return point ? formatDate(point.date) : ''
                            }}
                            formatter={(value, _name, props) => {
                                const point = props.payload
                                if (value === undefined) return ['Inget ägg', '']
                                if (point.eggCount === 1) {
                                const egg = henEggs.find((e) => e.date === point.date)
                                if (egg) {
                                    const { breed, color } = getEggBreedInfo(egg)
                                    return [`${value} g`, `${breed} (${color})`]
                                }
                                }
                                return [`${value} g (snitt av ${point.eggCount} ägg)`, 'Vikt']
                            }}
                            />
                            <Bar dataKey="weightGrams" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}
    </div>
)
}

export default HenChart