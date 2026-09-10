import { useState } from 'react'
import { todayISO } from '../utils/date'
import { HENS, UNKNOWN_HEN, BREED_COLORS } from '../data/hens'

const UNKNOWN_PREFIX = 'unknown:'

function AddEggForm({ onAdd }) {
    const [date, setDate] = useState(todayISO())
    const [weight, setWeight] = useState('')
    const [hen, setHen] = useState(HENS[0]?.name ?? '')
    const [error, setError] = useState('')

    const isUnknown = hen.startsWith(UNKNOWN_PREFIX)

    function handleSubmit(e) {
        e.preventDefault()
        setError('')

        const weightNum = parseFloat(weight)
        if (!hen) return setError('Välj en höna.')
        if (!weight || Number.isNaN(weightNum) || weightNum <= 0) {
        return setError('Ange en vikt större än 0.')
        }
        if (!date) return setError('Välj ett datum.')

        const egg = { date, weightGrams: weightNum }
        if (isUnknown) {
            const breed = hen.slice(UNKNOWN_PREFIX.length)
            egg.hen = UNKNOWN_HEN
            egg.color = BREED_COLORS[breed]
        } else {
            egg.hen = hen
        }

        onAdd(egg)
        setWeight('')
    }

    return (
        <form className="egg-form" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="hen">Höna</label>
                <select id="hen"  onChange={(e) => setHen(e.target.value)}>
                    {Object.entries(BREED_COLORS).map(([breed, color]) => (
                        <option key={breed} value={`${UNKNOWN_PREFIX}${breed}`}>
                            {UNKNOWN_HEN} {breed} ({color})
                        </option>
                    ))}
                    {HENS.map((h) => (
                        <option key={h.name} value={h.name}>
                        {h.name} ({h.breed})
                        </option>
                    ))}
                </select>
            </div>
            <div className="field">
                <label htmlFor="date">Datum</label>
                <input id="date" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
            </div>
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