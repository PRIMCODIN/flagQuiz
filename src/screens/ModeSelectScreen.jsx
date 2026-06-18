import { useNavigate } from 'react-router-dom'
import { Map, SlidersHorizontal, Play, Trophy, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ModeSelectScreen() {
    const navigate = useNavigate()
    const { profile, signOut } = useAuth()

    return (
        <div className="modes-container">
            <div className="modes-card">
                <div className="modes-header">
                    <h1 className="modes-title">Elige un modo</h1>
                    <p className="modes-subtitle">
                        Jugando como <strong>{profile?.displayName || 'Invitado'}</strong>
                    </p>
                </div>

                <div className="modes-grid">
                    <button
                        className="mode-tile mode-tile-primary"
                        onClick={() => navigate('/world-path')}
                        type="button"
                    >
                        <Map className="mode-icon" />
                        <div className="mode-text">
                            <div className="mode-name">World Path</div>
                            <div className="mode-desc">Progresión por niveles</div>
                        </div>
                    </button>

                    <button
                        className="mode-tile"
                        onClick={() => navigate('/free-mode')}
                        type="button"
                    >
                        <SlidersHorizontal className="mode-icon" />
                        <div className="mode-text">
                            <div className="mode-name">Free Mode</div>
                            <div className="mode-desc">Elige continente y dificultad</div>
                        </div>
                    </button>

                    <button
                        className="mode-tile"
                        onClick={() => navigate('/game', { state: { mode: 'classic', continent: 'World', difficulty: 'normal' } })}
                        type="button"
                    >
                        <Play className="mode-icon" />
                        <div className="mode-text">
                            <div className="mode-name">Clásico</div>
                            <div className="mode-desc">Partida rápida (World)</div>
                        </div>
                    </button>

                    <button
                        className="mode-tile"
                        onClick={() => navigate('/public-rankings')}
                        type="button"
                    >
                        <Trophy className="mode-icon" />
                        <div className="mode-text">
                            <div className="mode-name">Ranking</div>
                            <div className="mode-desc">Ver mejores puntuaciones</div>
                        </div>
                    </button>

                    {!profile?.isGuest && (
                        <button
                            className="mode-tile"
                            onClick={() => navigate('/profile')}
                            type="button"
                        >
                            <User className="mode-icon" />
                            <div className="mode-text">
                                <div className="mode-name">Perfil</div>
                                <div className="mode-desc">Ver tus estadísticas</div>
                            </div>
                        </button>
                    )}
                </div>

                <div className="modes-actions">
                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={async () => {
                            try {
                                await signOut()
                            } finally {
                                navigate('/', { replace: true })
                            }
                        }}
                    >
                        <LogOut className="button-icon" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}

