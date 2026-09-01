import { useState } from 'react'
import AddEggForm from './components/AddEggForm'
import EggTable from './components/EggTable'
import HenChart from './components/HenChart'
import { useEggs } from './hooks/useEggs'
import './App.css'

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