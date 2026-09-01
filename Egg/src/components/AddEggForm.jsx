import { useMemo, useState } from 'react'
import { todayISO } from '../utils/date'

function AddEggForm({ onAdd, eggs }) {
    const [date, setDate] = useState(todayISO())
    const [color, setColor] = useState('')
    const [weight, setWeight] = useState('')
    const [hen, setHen] = useState('')
    const [error, setError] = useState('')

    const henOptions = useMemo(
        () => [...new Set(eggs.map((e) => e.hen))].sort((a, b) => a.localeCompare(b)),
        [eggs]
    )
    const colorOptions = useMemo(
        () => [...new Set(eggs.map((e) => e.color))].sort((a, b) => a.localeCompare(b)),
        [eggs]
    )

    function handleSubmit(e) {
        e.preventDefault()
        setError('')

        const weightNum = parseFloat(weight)
        if (!hen.trim()) return setError('Enter which hen laid the egg.')
        if (!color.trim()) return setError('Enter the egg color.')
        if (!weight || Number.isNaN(weightNum) || weightNum <= 0) {
        return setError('Enter a weight greater than 0.')
        }
        if (!date) return setError('Pick a date.')

        onAdd({ date, color: color.trim(), weightGrams: weightNum, hen: hen.trim() })
        setColor('')
        setWeight('')
    }

    return (
        <form className="egg-form" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="hen">Höna</label>
                <input
                id="hen"
                list="hen-options"
                autoComplete="off"
                value={hen}
                onChange={(e) => setHen(e.target.value)}
                placeholder="tex Augusta"
                />
                <datalist id="hen-options">
                {henOptions.map((h) => (
                    <option key={h} value={h} />
                ))}
                </datalist>
            </div>
            <div className="field">
                <label htmlFor="date">Datum</label>
                <input id="date" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="color">Färg</label>
                <input
                id="color"
                list="color-options"
                autoComplete="off"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="tex Ljusbrunt"
                />
                <datalist id="color-options">
                {colorOptions.map((c) => (
                    <option key={c} value={c} />
                ))}
                </datalist>
            </div>
            <div className="field">
                <label htmlFor="weight">Vikt  (gram)</label>
                <input id="weight" type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="tex 38" />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="primary">Lägg till ägg</button>
        </form>
    )
}

export default AddEggForm