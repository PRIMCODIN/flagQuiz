import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal, Award, Home, Search, X } from 'lucide-react'
import { getLeaderboard, subscribeToRanking } from '../utils/database'
import { formatTime } from '../utils/gameUtils'
import toast from 'react-hot-toast'
import '../styles/main.css'

// Número de puestos que se muestran por defecto (sin búsqueda activa).
const TOP_LIMIT = 10

export default function RankingScreen() {
    const navigate = useNavigate()
    const [ranking, setRanking] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadRanking()
    }, [])

    useEffect(() => {
        const subscription = subscribeToRanking(() => {
            loadRanking()
            toast('🔄 Ranking actualizado', { icon: '🏆' })
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loadRanking = async () => {
        setIsLoading(true)
        try {
            const data = await getLeaderboard({ limit: 100 })
            setRanking(data)
        } catch (error) {
            console.error('Error loading ranking:', error)
            toast.error('Error al cargar el ranking')
        } finally {
            setIsLoading(false)
        }
    }

    const isSearching = searchTerm.trim().length > 0

    // Sin búsqueda: Top 10. Con búsqueda: todos los que coincidan por nombre.
    const displayedRanking = isSearching
        ? ranking.filter((entry) =>
            entry.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : ranking.slice(0, TOP_LIMIT)

    const clearSearch = () => setSearchTerm('')

    const getMedalIcon = (rank) => {
        if (rank === 1) return <Trophy className="medal-icon medal-gold" />
        if (rank === 2) return <Medal className="medal-icon medal-silver" />
        if (rank === 3) return <Award className="medal-icon medal-bronze" />
        return <span className="rank-number">#{rank}</span>
    }

    return (
        <div className="ranking-container">
            <div className="ranking-content">
                <div className="ranking-header">
                    <Trophy className="ranking-trophy-icon" />
                    <h1 className="ranking-title">Clasificación</h1>
                    <p className="ranking-subtitle">
                        Top {TOP_LIMIT} · {ranking.length} {ranking.length === 1 ? 'participante' : 'participantes'}
                    </p>
                </div>

                <div className="search-bar-container">
                    <div className="search-bar">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button onClick={clearSearch} className="search-clear">
                                <X className="clear-icon" />
                            </button>
                        )}
                    </div>
                </div>

                {!isLoading && !isSearching && ranking.length >= 3 && (
                    <div className="podium-card">
                        <h2 className="podium-title">🏆 Podio 🏆</h2>

                        <div className="podium-container">
                            <div className="podium-position">
                                <div className="podium-medal podium-silver">
                                    <Medal className="podium-icon" />
                                    <div className="podium-rank">2º</div>
                                </div>
                                <div className="podium-username">{ranking[1].displayName}</div>
                                <div className="podium-score">{ranking[1].score} pts</div>
                            </div>

                            <div className="podium-position podium-first">
                                <div className="podium-medal podium-gold">
                                    <Trophy className="podium-icon" />
                                    <div className="podium-rank">1º</div>
                                </div>
                                <div className="podium-username">{ranking[0].displayName}</div>
                                <div className="podium-score">{ranking[0].score} pts</div>
                            </div>

                            <div className="podium-position">
                                <div className="podium-medal podium-bronze">
                                    <Award className="podium-icon" />
                                    <div className="podium-rank">3º</div>
                                </div>
                                <div className="podium-username">{ranking[2].displayName}</div>
                                <div className="podium-score">{ranking[2].score} pts</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="ranking-list-card">
                    <div className="ranking-list-header">
                        <h2 className="ranking-list-title">
                            {isSearching ? 'Resultados de búsqueda' : `Top ${TOP_LIMIT}`}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="ranking-loading">
                            <div className="loading-spinner"></div>
                            <p className="loading-text">Cargando ranking...</p>
                        </div>
                    ) : displayedRanking.length === 0 ? (
                        <div className="ranking-empty">
                            <Trophy className="empty-icon" />
                            <p className="empty-text">
                                {isSearching
                                    ? `No se encontraron resultados para "${searchTerm}"`
                                    : 'No hay partidas registradas todavía'}
                            </p>
                        </div>
                    ) : (
                        <div className="ranking-list">
                            {displayedRanking.map((entry) => (
                                <div
                                    key={entry.rank + entry.displayName + entry.createdAt}
                                    className="ranking-item"
                                >
                                    <div className="ranking-item-content">
                                        <div className="ranking-position">
                                            {getMedalIcon(entry.rank)}
                                        </div>

                                        <div className="ranking-player">
                                            <div className="player-name-container">
                                                <div className="player-name">{entry.displayName}</div>
                                            </div>
                                        </div>

                                        <div className="ranking-stats">
                                            <div className="ranking-details">
                                                <div className="detail-text">
                                                    {entry.correctAnswers}/{entry.totalQuestions}
                                                </div>
                                                <div className="detail-subtext">
                                                    {formatTime(entry.timeSeconds)}
                                                </div>
                                            </div>

                                            <div className="ranking-score-box">
                                                <div className="ranking-score">{entry.score}</div>
                                                <div className="ranking-score-label">puntos</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate('/modes')}
                    className="button button-home"
                >
                    <Home className="button-icon" />
                    Volver a los modos
                </button>

                <div className="ranking-footer">
                    <p className="footer-stats">
                        Actualización en tiempo real • {ranking.length} participantes
                    </p>
                </div>
            </div>
        </div>
    )
}