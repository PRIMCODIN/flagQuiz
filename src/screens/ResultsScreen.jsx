import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'
import { Trophy, Clock, CheckCircle, RotateCcw, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitScore } from '../utils/database'
import { formatTime } from '../utils/gameUtils'
import { useAuth } from '../context/AuthContext'
import { markLevelCompleted } from '../utils/worldPath'
import '../styles/main.css'

export default function ResultsScreen() {
    const navigate = useNavigate()
    const { user, profile } = useAuth()
    const [showConfetti, setShowConfetti] = useState(false)
    const [isSaving, setIsSaving] = useState(true)
    const hasSavedRef = useRef(false)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const gameResults = JSON.parse(localStorage.getItem('gameResults') || '{}')

    const correctAnswers = gameResults.answers?.filter(a => a.isCorrect).length || 0
    const totalQuestions = gameResults.totalQuestions || 12
    const score = gameResults.score || 0
    const totalTime = gameResults.answers?.reduce((sum, a) => sum + (15 - a.timeRemaining), 0) || 0

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const saveScore = useCallback(async () => {
        if (!gameResults.answers) {
            navigate('/')
            return
        }

        try {
            const displayName = profile?.displayName || 'Invitado'
            const userId = profile?.isGuest ? null : user?.id || profile?.id || null

            await submitScore({
                userId,
                displayName,
                score,
                correctAnswers,
                totalQuestions,
                timeSeconds: totalTime,
                mode: gameResults.mode || 'classic'
            })

            if (gameResults.worldLevelId && correctAnswers >= totalQuestions * 0.7) {
                markLevelCompleted(profile?.id, gameResults.worldLevelId)
            }

            if (correctAnswers >= totalQuestions * 0.7) {
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 5000)
            }

            setIsSaving(false)
            toast.success('¡Puntuación guardada en el ranking!')
        } catch (error) {
            console.error('Error guardando puntuación:', error)
            toast.error('Error al guardar. Inténtalo de nuevo.')
            setIsSaving(false)
        }
    }, [correctAnswers, gameResults.answers, gameResults.mode, gameResults.worldLevelId, navigate, profile?.displayName, profile?.id, profile?.isGuest, score, totalQuestions, totalTime, user?.id])

    useEffect(() => {
        if (hasSavedRef.current) return
        hasSavedRef.current = true
        saveScore()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePlayAgain = () => {
        localStorage.removeItem('gameResults')
        navigate('/modes')
    }

    const handleViewRanking = () => {
        navigate('/ranking')
    }

    const getCongratulationMessage = () => {
        if (correctAnswers >= totalQuestions * 0.8) return '¡Increíble resultado! 🎉'
        if (correctAnswers >= totalQuestions * 0.6) return '¡Buen trabajo! 👏'
        return '¡Sigue practicando! 💪'
    }

    if (isSaving) {
        return (
            <div className="results-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Guardando resultados...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="results-container">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}

            <div className="results-content">
                <div className="results-header">
                    <Trophy className="results-trophy-icon" />
                    <h1 className="results-title">¡Partida Finalizada!</h1>
                    <p className="results-message">{getCongratulationMessage()}</p>
                </div>

                <div className="score-card">
                    <div className="main-score">
                        <div className="score-number">{score}</div>
                        <div className="score-label">puntos totales</div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-box stat-success">
                            <CheckCircle className="stat-icon" />
                            <div className="stat-value">{correctAnswers}/{totalQuestions}</div>
                            <div className="stat-label">acertadas</div>
                        </div>

                        <div className="stat-box stat-time">
                            <Clock className="stat-icon" />
                            <div className="stat-value">{formatTime(totalTime)}</div>
                            <div className="stat-label">tiempo total</div>
                        </div>
                    </div>

                    <div className="rank-box">
                        <div className="rank-header">
                            <BarChart3 className="rank-icon" />
                            <span className="rank-text">Tu puntuación se ha guardado en el ranking global</span>
                        </div>
                    </div>
                </div>

                <div className="answers-card">
                    <h2 className="answers-title">
                        <CheckCircle className="answers-icon" />
                        Resumen de respuestas
                    </h2>

                    <div className="answers-list">
                        {gameResults.answers?.map((answer, index) => (
                            <div
                                key={index}
                                className={`answer-item ${answer.isCorrect ? 'answer-correct' : 'answer-wrong'}`}
                            >
                                <div className="answer-content">
                                    <div className={`answer-number ${answer.isCorrect ? 'number-correct' : 'number-wrong'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="answer-details">
                                        <div className="answer-country">{answer.correctAnswer}</div>
                                        {!answer.isCorrect && answer.selectedAnswer && (
                                            <div className="answer-selected">
                                                Respondiste: {answer.selectedAnswer}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {answer.isCorrect && (
                                    <div className="answer-points">
                                        +{answer.pointsEarned} pts
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={handleViewRanking}
                        className="button button-primary"
                    >
                        <Trophy className="button-icon" />
                        Ver Ranking Completo
                    </button>

                    <button
                        onClick={handlePlayAgain}
                        className="button button-secondary"
                    >
                        <RotateCcw className="button-icon" />
                        Jugar de Nuevo
                    </button>
                </div>

                <div className="results-footer">
                    <p className="footer-message">
                        ¡Comparte tu puntuación con tus amigos! 🎯
                    </p>
                </div>
            </div>
        </div>
    )
}