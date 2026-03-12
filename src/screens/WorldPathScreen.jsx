import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react'
import { WORLD_LEVELS, loadWorldPathProgress } from '../utils/worldPath'
import { useAuth } from '../context/AuthContext'

export default function WorldPathScreen() {
    const navigate = useNavigate()
    const { profile } = useAuth()
    const [progressRefresh, setProgressRefresh] = useState(0)

    const progress = useMemo(() => {
        // progressRefresh forces recompute after coming back
        void progressRefresh
        return loadWorldPathProgress(profile?.id)
    }, [profile?.id, progressRefresh])

    const unlockedIndex = useMemo(() => {
        let idx = 0
        for (let i = 0; i < WORLD_LEVELS.length; i++) {
            if (progress[WORLD_LEVELS[i].id]) idx = i + 1
            else break
        }
        return Math.min(idx, WORLD_LEVELS.length - 1)
    }, [progress])

    const canPlay = (levelIndex) => levelIndex <= unlockedIndex

    return (
        <div className="worldpath-container">
            <div className="worldpath-card">
                <div className="worldpath-top">
                    <button className="icon-button" type="button" onClick={() => navigate('/modes')}>
                        <ArrowLeft />
                    </button>
                    <div className="worldpath-titlewrap">
                        <h1 className="worldpath-title">World Path</h1>
                        <p className="worldpath-subtitle">Completa niveles para desbloquear el siguiente</p>
                    </div>
                </div>

                <div className="worldpath-levels">
                    {WORLD_LEVELS.map((level, index) => {
                        const completed = Boolean(progress[level.id])
                        const locked = !canPlay(index)

                        return (
                            <button
                                key={level.id}
                                type="button"
                                className={`level-row ${completed ? 'level-completed' : ''} ${locked ? 'level-locked' : ''}`}
                                disabled={locked}
                                onClick={() => {
                                    navigate('/game', {
                                        state: {
                                            mode: `world_${level.id}`,
                                            worldLevelId: level.id,
                                            continent: level.continent,
                                            difficulty: level.difficulty
                                        }
                                    })
                                }}
                            >
                                <div className="level-left">
                                    <div className="level-badge">
                                        {completed ? <CheckCircle2 className="level-badge-icon" /> : locked ? <Lock className="level-badge-icon" /> : <span className="level-number">{index + 1}</span>}
                                    </div>
                                    <div className="level-info">
                                        <div className="level-name">{level.name}</div>
                                        <div className="level-meta">
                                            {level.continent === 'World' ? 'Mundial' : level.continent} • {level.difficulty}
                                        </div>
                                    </div>
                                </div>

                                <div className="level-right">
                                    {completed ? <span className="pill pill-success">Completado</span> : locked ? <span className="pill">Bloqueado</span> : <span className="pill pill-primary">Jugar</span>}
                                </div>
                            </button>
                        )
                    })}
                </div>

                <div className="worldpath-footer">
                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={() => setProgressRefresh((v) => v + 1)}
                    >
                        Actualizar progreso
                    </button>
                </div>
            </div>
        </div>
    )
}

