import { useMemo } from 'react'

function computeStats(eggs) {
    const map = new Map()
    for (const egg of eggs) {
        if (!map.has(egg.hen)) map.set(egg.hen, { hen: egg.hen, count: 0, totalWeight: 0 })
        const entry = map.get(egg.hen)
        entry.count += 1
        entry.totalWeight += egg.weightGrams
    }
    return [...map.values()].map((e) => ({ ...e, avgWeight: e.totalWeight / e.count }))
}

const MEDALS = ['🥇', '🥈', '🥉']
const PODIUM_ORDER = [1, 0, 2]

function Podium({ ranked, formatValue }) {
    const top3 = ranked.slice(0, 3)
    return (
        <div className="podium">
        {PODIUM_ORDER.filter((i) => top3[i]).map((i) => {
            const entry = top3[i]
            return (
            <div key={entry.hen} className={`podium-place place-${i + 1}`}>
                <div className="podium-medal">{MEDALS[i]}</div>
                <div className="podium-block">
                <span className="podium-hen">{entry.hen}</span>
                <span className="podium-count">{formatValue(entry)}</span>
                </div>
            </div>
            )
        })}
        </div>
    )
}

function Leaderboard({ eggs }) {
    const stats = useMemo(() => computeStats(eggs), [eggs])

    const byCount = useMemo(
        () => [...stats].sort((a, b) => b.count - a.count || a.hen.localeCompare(b.hen)),
        [stats]
    )
    const byAvgWeight = useMemo(
        () => [...stats].sort((a, b) => b.avgWeight - a.avgWeight || a.hen.localeCompare(b.hen)),
        [stats]
    )

    if (stats.length === 0) {
        return <p className="hint">Inga ägg registrerade ännu.</p>
    }

    return (
    <div>
        <h3 className="podium-title">Flest ägg</h3>
        <Podium ranked={byCount} formatValue={(e) => `${e.count} ägg`} />

        <h3 className="podium-title">Högst snittvikt</h3>
        <Podium ranked={byAvgWeight} formatValue={(e) => `${e.avgWeight.toFixed(1)} g snitt`} />

    
        <div className="table-wrap" style={{ marginTop: 24 }}>
            <table>
            <thead>
                <tr>
                <th>Höna</th>
                <th>Antal ägg</th>
                <th>Snittvikt (gram)</th>
                </tr>
            </thead>
            <tbody>
                {byCount.map((entry) => (
                <tr key={entry.hen}>
                    <td>{entry.hen}</td>
                    <td>{entry.count}</td>
                    <td>{entry.avgWeight.toFixed(1)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    )
}

export default Leaderboard