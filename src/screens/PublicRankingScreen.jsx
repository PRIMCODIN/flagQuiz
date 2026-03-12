import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal, Award, Home, Search, X } from 'lucide-react'
import { getLeaderboard, subscribeToRanking } from '../utils/database'
import { formatTime } from '../utils/gameUtils'
import toast from 'react-hot-toast'

export default function PublicRankingScreen() {
    const navigate = useNavigate()
    const [ranking, setRanking] = useState([])
    const [filteredRanking, setFilteredRanking] = useState([])
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

    useEffect(() => {
        let result = [...ranking]

        if (searchTerm.trim()) {
            result = result.filter(entry =>
                entry.displayName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredRanking(result)
    }, [ranking, searchTerm])

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

    const getMedalIcon = (rank) => {
        if (rank === 1) return <Trophy className="medal-icon medal-gold" />
        if (rank === 2) return <Medal className="medal-icon medal-silver" />
        if (rank === 3) return <Award className="medal-icon medal-bronze" />
        return <span className="rank-number">#{rank}</span>
    }

    const clearSearch = () => {
        setSearchTerm('')
    }

    return (
        <div className="ranking-container">
            <div className="ranking-content">
                <div className="ranking-header">
                    <Trophy className="ranking-trophy-icon" />
                    <h1 className="ranking-title">Clasificación General</h1>
                    <p className="ranking-subtitle">
                        {filteredRanking.length} {filteredRanking.length === 1 ? 'participante' : 'participantes'}
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

                {!isLoading && !searchTerm && filteredRanking.length >= 3 && (
                    <div className="podium-card">
                        <h2 className="podium-title">🏆 Podio 🏆</h2>

                        <div className="podium-container">
                            <div className="podium-position">
                                <div className="podium-medal podium-silver">
                                    <Medal className="podium-icon" />
                                    <div className="podium-rank">2º</div>
                                </div>
                                <div className="podium-username">{filteredRanking[1].displayName}</div>
                                <div className="podium-score">{filteredRanking[1].score} pts</div>
                            </div>

                            <div className="podium-position podium-first">
                                <div className="podium-medal podium-gold">
                                    <Trophy className="podium-icon" />
                                    <div className="podium-rank">1º</div>
                                </div>
                                <div className="podium-username">{filteredRanking[0].displayName}</div>
                                <div className="podium-score">{filteredRanking[0].score} pts</div>
                            </div>

                            <div className="podium-position">
                                <div className="podium-medal podium-bronze">
                                    <Award className="podium-icon" />
                                    <div className="podium-rank">3º</div>
                                </div>
                                <div className="podium-username">{filteredRanking[2].displayName}</div>
                                <div className="podium-score">{filteredRanking[2].score} pts</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="ranking-list-card">
                    <div className="ranking-list-header">
                        <h2 className="ranking-list-title">Clasificación Completa</h2>
                    </div>

                    {isLoading ? (
                        <div className="ranking-loading">
                            <div className="loading-spinner"></div>
                            <p className="loading-text">Cargando ranking...</p>
                        </div>
                    ) : filteredRanking.length === 0 ? (
                        <div className="ranking-empty">
                            <Trophy className="empty-icon" />
                            <p className="empty-text">
                                {searchTerm
                                    ? `No se encontraron resultados para "${searchTerm}"`
                                    : 'No hay partidas registradas todavía'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="ranking-list">
                            {filteredRanking.map((entry) => (
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
                    onClick={() => navigate('/')}
                    className="button button-home"
                >
                    <Home className="button-icon" />
                    Volver al Inicio
                </button>

                <div className="ranking-footer">
                    <p className="footer-stats">
                        Actualización en tiempo real • {ranking.length} {ranking.length === 1 ? 'participante' : 'participantes'} total
                    </p>
                </div>
            </div>
        </div>
    )
}