import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'

const CONTINENTS = ['World', 'Europe', 'Africa', 'Asia', 'America', 'Oceania']
const DIFFICULTIES = [
    { id: 'easy', label: 'Easy' },
    { id: 'normal', label: 'Normal' },
    { id: 'hard', label: 'Hard' }
]

export default function FreeModeScreen() {
    const navigate = useNavigate()
    const [continent, setContinent] = useState('World')
    const [difficulty, setDifficulty] = useState('normal')

    const mode = useMemo(() => {
        const c = continent.toLowerCase()
        return `free_${difficulty}_${c}`
    }, [continent, difficulty])

    return (
        <div className="freemode-container">
            <div className="freemode-card">
                <div className="freemode-top">
                    <button className="icon-button" type="button" onClick={() => navigate('/modes')}>
                        <ArrowLeft />
                    </button>
                    <div className="freemode-titlewrap">
                        <h1 className="freemode-title">Free Mode</h1>
                        <p className="freemode-subtitle">Personaliza tu partida</p>
                    </div>
                </div>

                <div className="freemode-section">
                    <div className="section-label">Continente</div>
                    <div className="segmented">
                        {CONTINENTS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`segmented-btn ${continent === c ? 'segmented-btn-active' : ''}`}
                                onClick={() => setContinent(c)}
                            >
                                {c === 'World' ? 'Mundo' : c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="freemode-section">
                    <div className="section-label">Dificultad</div>
                    <div className="segmented">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d.id}
                                type="button"
                                className={`segmented-btn ${difficulty === d.id ? 'segmented-btn-active' : ''}`}
                                onClick={() => setDifficulty(d.id)}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                    <div className="freemode-hint">
                        Easy: banderas más conocidas • Hard: incluye territorios y banderas difíciles
                    </div>
                </div>

                <div className="freemode-actions">
                    <button
                        className="button button-primary"
                        type="button"
                        onClick={() =>
                            navigate('/game', {
                                state: {
                                    mode,
                                    continent,
                                    difficulty
                                }
                            })
                        }
                    >
                        <Play className="button-icon" />
                        Empezar
                    </button>
                </div>
            </div>
        </div>
    )
}

