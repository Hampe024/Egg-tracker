import { useState } from 'react'
import AddEggForm from './components/AddEggForm'
import EggTable from './components/EggTable'
import HenChart from './components/HenChart'
import Leaderboard from './components/Leaderboard'
import { getBreedByColor, getEggBreedInfo, UNKNOWN_HEN } from './data/hens'
import { useEggs } from './hooks/useEggs'
import './App.css'

const TABS = [
	{ id: 'table', label: 'Tabell' },
	{ id: 'chart', label: 'Graf' },
	{ id: 'leaderboard', label: 'Höns' },
	{ id: 'breeds', label: 'Raser' },
]

function breedGroupKey(egg) {
  const { breed } = getEggBreedInfo(egg)
  if (breed !== UNKNOWN_HEN) return breed
  return getBreedByColor(egg.color) ?? UNKNOWN_HEN
}

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

				{tab === 'leaderboard' && (
					<section className="panel">
						<h2>Topplista</h2>
						<Leaderboard eggs={eggs} keyFn={(egg) => egg.hen} keyLabel="Höna" />
					</section>
				)}

				{tab === 'breeds' && (
					<section className="panel">
						<h2>Rastopplista</h2>
						<Leaderboard eggs={eggs} keyFn={breedGroupKey} keyLabel="Ras" />
					</section>
				)}
			</main>
		</div>
	)
}

export default App