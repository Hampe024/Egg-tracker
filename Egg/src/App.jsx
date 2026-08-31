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
import { useEggs } from './hooks/useEggs'
import './App.css'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

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
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[20, 80]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip
              formatter={(value, _name, props) => [`${value} g`, props.payload.color]}
              labelFormatter={(label) => `Egg on ${label}`}
            />
            <Bar dataKey="weightGrams" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const TABS = [
  { id: 'table', label: 'Alla  ägg' },
  { id: 'chart', label: 'Jämför hönor' },
]

function App() {
  const { eggs, addEgg, deleteEgg, loading } = useEggs()
  const [tab, setTab] = useState('table')

  if (loading) {
    return <div className="app"><p className="hint">Kläcker ägg…</p></div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Villa Gistviks ägg</h1>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'table' && (
          <section className="panel">
            <h2>Lägg till ett nytt ägg</h2>
            <AddEggForm onAdd={addEgg} eggs={eggs} />
            <h2 style={{ marginTop: 24 }}>Alla Ägg</h2>
            <EggTable eggs={eggs} onDelete={deleteEgg} />
          </section>
        )}

        {tab === 'chart' && (
          <section className="panel">
            <h2>Äggvikts ändring</h2>
            <HenChart eggs={eggs} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App