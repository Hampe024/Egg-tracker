import { useMemo, useState } from 'react'
import { todayISO } from '../utils/date'
import { HENS, UNKNOWN_HEN } from '../data/hens'

function AddEggForm({ onAdd, eggs }) {
    const [date, setDate] = useState(todayISO())
    const [weight, setWeight] = useState('')
    const [hen, setHen] = useState(HENS[0]?.name ?? '')
    const [color, setColor] = useState('')
    const [error, setError] = useState('')

    const isUnknown = hen === UNKNOWN_HEN

    const colorOptions = useMemo(
        () =>
        [...new Set(
            eggs.filter((e) => e.hen === UNKNOWN_HEN && e.color).map((e) => e.color)
        )].sort((a, b) => a.localeCompare(b)),
        [eggs]
    )

    function handleSubmit(e) {
        e.preventDefault()
        setError('')

        const weightNum = parseFloat(weight)
        if (!hen) return setError('Välj en höna.')
        if (isUnknown && !color.trim()) return setError('Ange äggets färg.')
        if (!weight || Number.isNaN(weightNum) || weightNum <= 0) {
        return setError('Ange en vikt större än 0.')
        }
        if (!date) return setError('Välj ett datum.')

        const egg = { date, weightGrams: weightNum, hen }
        if (isUnknown) egg.color = color.trim()

        onAdd(egg)
        setWeight('')
        if (isUnknown) setColor('')
    }

    return (
        <form className="egg-form" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="hen">Höna</label>
                <select id="hen" value={hen} onChange={(e) => setHen(e.target.value)}>
                    {HENS.map((h) => (
                        <option key={h.name} value={h.name}>
                        {h.name} ({h.breed})
                        </option>
                    ))}
                <option value={UNKNOWN_HEN}>{UNKNOWN_HEN}</option>
                </select>
            </div>
            <div className="field">
                <label htmlFor="date">Datum</label>
                <input id="date" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
            </div>
            {isUnknown && (
                <div className="field">
                <label htmlFor="color">Färg</label>
                <input
                    id="color"
                    list="color-options"
                    autoComplete="off"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="tex Grönt"
                />
                <datalist id="color-options">
                    {colorOptions.map((c) => (
                    <option key={c} value={c} />
                    ))}
                </datalist>
                </div>
            )}
            <div className="field">
                <label htmlFor="weight">Vikt  (gram)</label>
                <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="tex 38"
                />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="primary">Lägg till ägg</button>
        </form>
    )
}

export default AddEggForm