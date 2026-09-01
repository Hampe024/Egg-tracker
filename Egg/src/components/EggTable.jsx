import { useMemo } from 'react'
import { formatDate } from '../utils/date'

function EggTable({ eggs, onDelete }) {
    const sorted = useMemo(
        () => [...eggs].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
        [eggs]
    )

    if (sorted.length === 0) return <p className="hint">Inga ägg registrerade ännu — lägg till ett ovan.</p>

    return (
        <div className="table-wrap">
            <table>
                <thead>
                <tr>
                    <th>Datum</th>
                    <th>Höna</th>
                    <th>Färg</th>
                    <th>Vikt (gram)</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {sorted.map((egg) => (
                    <tr key={egg.id}>
                    <td>{formatDate(egg.date)}</td>
                    <td>{egg.hen}</td>
                    <td>{egg.color}</td>
                    <td>{egg.weightGrams}</td>
                    <td>
                        <button type="button" className="link-button" onClick={() => onDelete(egg.id)}>
                        Ta bort
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default EggTable