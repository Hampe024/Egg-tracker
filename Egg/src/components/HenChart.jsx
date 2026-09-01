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
import { formatDate } from '../utils/date'

function HenChart({ eggs }) {
    const hens = useMemo(
        () => [...new Set(eggs.map((e) => e.hen))].sort((a, b) => a.localeCompare(b)),
        [eggs]
    )
    const [selectedHen, setSelectedHen] = useState('')
    const activeHen = hens.includes(selectedHen) ? selectedHen : hens[0] ?? ''

    const chartData = useMemo(
        () =>
        eggs
            .filter((e) => e.hen === activeHen)
            .sort((a, b) => (a.date > b.date ? 1 : -1))
            .map((e) => ({ ...e, label: formatDate(e.date) })),
        [eggs, activeHen]
    )

    if (hens.length === 0) {
        return <p className="hint">Inga höns registrerade.</p>
    }

    return (
        <div>
            <div className="field" style={{ maxWidth: 240, marginBottom: 16 }}>
                <label htmlFor="hen-select">Höna</label>
                <select id="hen-select" value={activeHen} onChange={(e) => setSelectedHen(e.target.value)}>
                {hens.map((hen) => (
                    <option key={hen} value={hen}>{hen}</option>
                ))}
                </select>
            </div>

            {chartData.length === 0 ? (
                <p className="hint">{activeHen} har inga ägg registrerade.</p>
            ) : (
                <ResponsiveContainer width="100%" height={340}>
                <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                    dataKey="id"
                    tickFormatter={(id) => {
                        const point = chartData.find((d) => d.id === id)
                        return point ? formatDate(point.date) : ''
                    }}
                    tick={{ fontSize: 12 }}
                    />
                    <YAxis
                    domain={[20, 80]}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    />
                    <Tooltip
                    labelFormatter={(_, payload) => {
                        const point = payload?.[0]?.payload
                        return point ? `Ägg från ${formatDate(point.date)}` : ''
                    }}
                    formatter={(value, _name, props) => [`${value} g`, props.payload.color]}
                    />
                    <Bar dataKey="weightGrams" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default HenChart