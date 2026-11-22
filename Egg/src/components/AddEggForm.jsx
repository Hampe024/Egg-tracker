import { useState } from 'react'
import toast from 'react-hot-toast'
import { todayISO } from '../utils/date'
import { HENS, UNKNOWN_HEN, BREED_COLORS } from '../data/hens'

const UNKNOWN_PREFIX = 'unknown:'

function AddEggForm({ onAdd }) {
    const [date, setDate] = useState(todayISO())
    const [hen, setHen] = useState('')

    const isUnknown = hen.startsWith(UNKNOWN_PREFIX)

    function handleSubmit(e) {
        e.preventDefault()

        if (!hen) return toast.error('Välj en ras.')
        if (!date) return toast.error('Välj ett datum.')

        const egg = { date }
        if (isUnknown) {
            const breed = hen.slice(UNKNOWN_PREFIX.length)
            egg.hen = UNKNOWN_HEN
            egg.color = BREED_COLORS[breed]
        } else {
            egg.hen = hen
        }

        onAdd(egg)
    }

    return (
        <form className="egg-form" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="hen">Ras(färg)</label>
                <select id="hen" value={hen} onChange={(e) => setHen(e.target.value)}>
                    <option disabled value="">Välj ras</option>
                    {Object.entries(BREED_COLORS).map(([breed, color]) => (
                        <option key={breed} value={`${breed}`}>
                            {breed} ({color})
                        </option>
                    ))}
                    {/* {HENS.map((h) => (
                        <option key={h.name} value={h.name}>
                            {h.name} ({h.breed})
                        </option>
                    ))} */}
                </select>
            </div>
            <div className="field">
                <label htmlFor="date">Datum</label>
                <input id="date" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button type="submit" className="primary">Lägg till ägg</button>
        </form>
    )
}

export default AddEggForm