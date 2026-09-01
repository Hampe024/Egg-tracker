import { useMemo, useState } from 'react'
import { formatDate } from '../utils/date'
import { getEggBreedInfo, UNKNOWN_HEN } from '../data/hens'

function EggTable({ eggs, onDelete }) {
    const [selectedId, setSelectedId] = useState(null)

    const sorted = useMemo(
        () => [...eggs].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
        [eggs]
    )

    const selectedEgg = useMemo(
        () => sorted.find((e) => e.id === selectedId) ?? null,
        [sorted, selectedId]
    )

    if (sorted.length === 0) return <p className="hint">Inga ägg registrerade ännu — lägg till ett ovan.</p>

    function toggleRow(id) {
        setSelectedId((current) => (current === id ? null : id))
    }

    function handleDelete() {
        if (!selectedId) return
        onDelete(selectedId)
        setSelectedId(null)
    }

    return (
        <div>
            {selectedId && (
                <div className="row-actions">
                <span className="hint">
                    Vill du ta bort{' '}
                    {selectedEgg.hen === UNKNOWN_HEN ? 'okänt ägg' : `${selectedEgg.hen}s ägg`} från{' '}
                    {formatDate(selectedEgg.date)}?
                </span>
                <button type="button" className="link-button danger" onClick={handleDelete}>
                    Ta bort
                </button>
                <button type="button" className="link-button" onClick={() => setSelectedId(null)}>
                    Avbryt
                </button>
                </div>
            )}
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                        <th>Datum</th>
                        <th>Höna</th>
                        <th>Ras</th>
                        <th>Vikt (gram)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((egg) => {
                        const { breed, color } = getEggBreedInfo(egg)
                        return (
                            <tr
                            key={egg.id}
                            className={egg.id === selectedId ? 'selected' : ''}
                            onClick={() => toggleRow(egg.id)}
                            >
                            <td>{formatDate(egg.date)}</td>
                            <td>{egg.hen}</td>
                            <td>{breed} ({color})</td>
                            <td>{egg.weightGrams}</td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EggTable