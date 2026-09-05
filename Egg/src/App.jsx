import { useState } from 'react'
import AddEggForm from './components/AddEggForm'
import EggTable from './components/EggTable'
import HenChart from './components/HenChart'
import EggCountChart from './components/EggCountChart'
import Leaderboard from './components/Leaderboard'
import { getEggBreedGroup } from './data/hens'
import { useEggs } from './hooks/useEggs'
// import { DUMMY_EGGS } from './dummyData' // DUMMY
import './App.css'

const TABS = [
	{ id: 'table', label: 'Tabell' },
	{ id: 'chart', label: 'Vikt' },
	{ id: 'eggcount', label: 'Ägg' },
	{ id: 'leaderboard', label: 'Hönor' },
	{ id: 'breeds', label: 'Raser' },
]

function breedGroupKey(egg) {
  const { breed } = getEggBreedInfo(egg)
  if (breed !== UNKNOWN_HEN) return breed
  return getBreedByColor(egg.color) ?? UNKNOWN_HEN
}

function App() {
	const { eggs, addEgg, deleteEgg, loading } = useEggs() // NON DUMMY
	// const eggs = DUMMY_EGGS // DUMMY
	// const addEgg = () => {} // DUMMY
	// const deleteEgg = () => {} // DUMMY
	// const loading = false // DUMMY
	const [tab, setTab] = useState('table')
	console.log(eggs)

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

				{tab === 'eggcount' && (
					<section className="panel">
						<h2>Antal ägg per dag</h2>
						<EggCountChart eggs={eggs} />
					</section>
				)}

				{tab === 'leaderboard' && (
					<section className="panel">
						<h2>Hönor</h2>
						<Leaderboard eggs={eggs} keyFn={(egg) => egg.hen} keyLabel="Höna" />
					</section>
				)}

				{tab === 'breeds' && (
					<section className="panel">
						<h2>Raser</h2>
						<Leaderboard eggs={eggs} keyFn={getEggBreedGroup} keyLabel="Ras" />
					</section>
				)}
			</main>
		</div>
	)
}

export default App