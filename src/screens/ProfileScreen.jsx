import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Trophy, BarChart3, Clock, ArrowLeft, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getUserStats } from '../utils/database'
import { formatTime } from '../utils/gameUtils'

export default function ProfileScreen() {
    const navigate = useNavigate()
    const { user, profile } = useAuth()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const load = async () => {
            if (!user || profile?.isGuest) {
                setLoading(false)
                navigate('/modes')
                return
            }
            try {
                const data = await getUserStats(user.id)
                setStats(data)
            } catch (err) {
                console.error('Error cargando estadísticas de usuario:', err)
                setError(true)
                toast.error('No se pudieron cargar tus estadísticas. Inténtalo de nuevo.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user, profile, navigate])

    // Salvaguarda: un invitado (o sin sesión) nunca debe ver el perfil; el useEffect
    // redirige a /modes, y aquí evitamos renderizar contenido mientras navega.
    if (!user || profile?.isGuest) return null

    return (
        <div className="ranking-container">
            <div className="ranking-content">
                <button
                    type="button"
                    className="icon-button"
                    onClick={() => navigate('/modes')}
                    style={{ marginBottom: '1rem' }}
                >
                    <ArrowLeft />
                </button>

                <div className="ranking-header">
                    <User className="ranking-trophy-icon" />
                    <h1 className="ranking-title">Tu perfil</h1>
                    <p className="ranking-subtitle">
                        {profile?.username || profile?.displayName || 'Invitado'}
                    </p>
                </div>

                {loading ? (
                    <div className="ranking-loading">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Cargando estadísticas...</p>
                    </div>
                ) : error ? (
                    <div className="ranking-empty">
                        <AlertCircle className="empty-icon" />
                        <p className="empty-text">
                            Hubo un problema al cargar tus estadísticas. Comprueba tu conexión e inténtalo de nuevo.
                        </p>
                    </div>
                ) : !stats || stats.gamesPlayed === 0 ? (
                    <div className="ranking-empty">
                        <Trophy className="empty-icon" />
                        <p className="empty-text">Aún no has jugado ninguna partida.</p>
                    </div>
                ) : (
                    <div className="ranking-list-card">
                        <div className="ranking-list-header">
                            <h2 className="ranking-list-title">Resumen personal</h2>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box stat-success">
                                <Trophy className="stat-icon" />
                                <div className="stat-value">{stats.bestScore}</div>
                                <div className="stat-label">mejor puntuación</div>
                            </div>

                            <div className="stat-box stat-time">
                                <BarChart3 className="stat-icon" />
                                <div className="stat-value">{stats.avgScore}</div>
                                <div className="stat-label">media de puntos</div>
                            </div>

                            <div className="stat-box">
                                <Clock className="stat-icon" />
                                <div className="stat-value">
                                    {formatTime(stats.avgTimeSecondsPerGame)}
                                </div>
                                <div className="stat-label">tiempo medio</div>
                            </div>
                        </div>

                        <div className="answers-card" style={{ marginTop: '1.5rem' }}>
                            <h2 className="answers-title">
                                <Trophy className="answers-icon" />
                                Últimas partidas
                            </h2>

                            <div className="answers-list">
                                {stats.recentGames.map((g, idx) => (
                                    <div key={idx} className="answer-item">
                                        <div className="answer-content">
                                            <div className="answer-number">
                                                {idx + 1}
                                            </div>
                                            <div className="answer-details">
                                                <div className="answer-country">
                                                    {g.mode}
                                                </div>
                                                <div className="answer-selected">
                                                    {g.correctAnswers}/{g.totalQuestions} aciertos •{' '}
                                                    {formatTime(g.timeSeconds)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="answer-points">
                                            {g.score} pts
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

