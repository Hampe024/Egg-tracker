import { useMemo, useState } from 'react'
import { formatDate } from '../utils/date'
import { getEggBreedInfo, UNKNOWN_HEN } from '../data/hens'

function EggTable({ eggs, onDelete }) {
    const [selectedId, setSelectedId] = useState(null)
    const [sortKey, setSortKey] = useState('date')
    const [sortDir, setSortDir] = useState('desc')

    const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1
    const withBreed = eggs.map((egg) => ({ egg, breed: getEggBreedInfo(egg).breed }))

    withBreed.sort((a, b) => {
        switch (sortKey) {
            case 'hen':
            return a.egg.hen.localeCompare(b.egg.hen) * dir
            case 'breed':
            return a.breed.localeCompare(b.breed) * dir
            case 'weight':
            return (a.egg.weightGrams - b.egg.weightGrams) * dir
            case 'date':
            default:
            return (a.egg.date < b.egg.date ? -1 : a.egg.date > b.egg.date ? 1 : 0) * dir
        }
        })

        return withBreed.map((x) => x.egg)
    }, [eggs, sortKey, sortDir])

    const selectedEgg = useMemo(
        () => sorted.find((e) => e.id === selectedId) ?? null,
        [sorted, selectedId]
    )

    if (sorted.length === 0) return <p className="hint">Inga ägg registrerade ännu — lägg till ett ovan.</p>

    function handleSort(key) {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    function sortIndicator(key) {
        const active = sortKey === key
        const arrow = active ? (sortDir === 'asc' ? '▲' : '▼') : '▲'
        return <span className={`sort-arrow${active ? ' active' : ''}`}>{arrow}</span>
    }

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
                        <th className="sortable" onClick={() => handleSort('date')}>
                            Datum{sortIndicator('date')}
                        </th>
                        <th className="sortable" onClick={() => handleSort('hen')}>
                            Höna{sortIndicator('hen')}
                        </th>
                        <th className="sortable" onClick={() => handleSort('breed')}>
                            Ras{sortIndicator('breed')}
                        </th>
                        <th className="sortable" onClick={() => handleSort('weight')}>
                            {sortIndicator('weight')}Vikt (g)
                        </th>
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