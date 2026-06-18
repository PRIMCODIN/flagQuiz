import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateQuestions, calculateScore, GAME_CONFIG } from '../utils/gameUtils'
import flagsData from '../assets/flags.json'
import '../styles/main.css'

// Placeholder SVG (data URI) que se muestra si una bandera no carga.
const FLAG_PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">' +
        '<rect width="256" height="256" rx="16" fill="#F5F5F5"/>' +
        '<path d="M70 60h12v140H70zM82 64h96l-18 28 18 28H82z" fill="#D1D1D1"/>' +
        '<text x="128" y="232" font-family="sans-serif" font-size="16" fill="#737373" text-anchor="middle">Bandera no disponible</text>' +
        '</svg>'
    )

export default function GameScreen() {
    const navigate = useNavigate()
    const location = useLocation()
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.TIME_PER_QUESTION)
    const [score, setScore] = useState(0)
    const [answers, setAnswers] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    // Timestamp (performance.now) del inicio de la partida. Se usa para medir
    // la duración real con decimales, en vez de derivarla del contador entero.
    const startTimeRef = useRef(null)

    const currentQuestion = questions[currentQuestionIndex]

    const moveToNextQuestion = useCallback(() => {
        setSelectedAnswer(null)
        setShowFeedback(false)
        setIsAnswered(false)
        setTimeRemaining(GAME_CONFIG.TIME_PER_QUESTION)

        setCurrentQuestionIndex((prev) => {
            if (prev < questions.length - 1) return prev + 1

            const config = location.state || { mode: 'classic', continent: 'World', difficulty: 'normal' }
            // Duración real total de la partida (segundos con decimales),
            // redondeada a 2 decimales para no almacenar floats largos.
            const elapsedSeconds = startTimeRef.current != null
                ? (performance.now() - startTimeRef.current) / 1000
                : 0
            const timeSeconds = Math.round(elapsedSeconds * 100) / 100
            const gameResults = {
                score,
                answers: [...answers],
                totalQuestions: questions.length,
                timeSeconds,
                mode: config.mode || 'classic',
                worldLevelId: config.worldLevelId || null,
                continent: config.continent || 'World',
                difficulty: config.difficulty || 'normal'
            }

            localStorage.setItem('gameResults', JSON.stringify(gameResults))
            navigate('/results')
            return prev
        })
    }, [answers, location.state, navigate, questions.length, score])

    const handleTimeout = useCallback(() => {
        if (!currentQuestion) return

        const newAnswer = {
            questionId: currentQuestion.id,
            selectedAnswer: null,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: false,
            timeRemaining: 0
        }

        setAnswers((prev) => [...prev, newAnswer])
        setIsAnswered(true)
        setShowFeedback(true)
        toast.error('¡Se acabó el tiempo!')

        setTimeout(() => {
            moveToNextQuestion()
        }, 1500)
    }, [currentQuestion, moveToNextQuestion])

    useEffect(() => {
        const config = location.state || { mode: 'classic', continent: 'World', difficulty: 'normal' }
        const generatedQuestions = generateQuestions(flagsData, GAME_CONFIG.NUM_QUESTIONS, {
            continent: config.continent,
            difficulty: config.difficulty
        })
        setQuestions(generatedQuestions)
        // Marca el inicio real de la partida (primera bandera).
        startTimeRef.current = performance.now()
    }, [location.state])

    useEffect(() => {
        if (questions.length === 0) return
        if (isAnswered) return
        if (timeRemaining <= 0) {
            handleTimeout()
            return
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeRemaining, isAnswered, questions.length, handleTimeout])

    const handleAnswer = (answer) => {
        if (isAnswered) return

        const isCorrect = answer === currentQuestion.correctAnswer
        const pointsEarned = isCorrect ? calculateScore(timeRemaining) : 0

        const newAnswer = {
            questionId: currentQuestion.id,
            selectedAnswer: answer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
            timeRemaining,
            pointsEarned
        }

        setSelectedAnswer(answer)
        setAnswers((prev) => [...prev, newAnswer])
        setIsAnswered(true)
        setShowFeedback(true)

        if (isCorrect) {
            setScore((prev) => prev + pointsEarned)
            toast.success(`¡Correcto! +${pointsEarned} puntos`)
        } else {
            toast.error(`Incorrecto. Era ${currentQuestion.correctAnswer}`)
        }

        setTimeout(() => {
            moveToNextQuestion()
        }, 1500)
    }

    const getTimerColorClass = () => {
        if (timeRemaining > 10) return 'timer-safe'
        if (timeRemaining > 5) return 'timer-warning'
        return 'timer-danger'
    }

    const timerProgress = (timeRemaining / GAME_CONFIG.TIME_PER_QUESTION) * 100
    const strokeDasharray = 974 // ≈ 2π·155 (radio del círculo)
    const strokeDashoffset = strokeDasharray - (strokeDasharray * timerProgress) / 100

    if (questions.length === 0) {
        return (
            <div className="game-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Cargando banderas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="game-container">
            <div className="game-content">
                <div className="game-header">
                    <div className="header-info">
                        <div className="progress-info">
                            <span className="question-counter">
                                Pregunta {currentQuestionIndex + 1}/{questions.length}
                            </span>
                        </div>

                        <div className="stats-container">
                            <div className={`timer-display ${getTimerColorClass()}`}>
                                <Clock className="timer-icon" />
                                {timeRemaining}s
                            </div>

                            <div className="score-display">
                                <Trophy className="score-icon" />
                                {score}
                            </div>
                        </div>
                    </div>

                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="question-card">
                    <div className="flag-container">
                        <svg className="circular-timer" viewBox="0 0 320 320" style={{ transform: 'rotate(-90deg)' }}>
                            <circle className="timer-track" cx="160" cy="160" r="155" />
                            <circle
                                className="timer-progress"
                                cx="160"
                                cy="160"
                                r="155"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>

                        <img
                            src={currentQuestion.flagUrl}
                            alt="Bandera del país a adivinar"
                            className="flag-image"
                            onError={(e) => {
                                if (e.currentTarget.src !== FLAG_PLACEHOLDER) {
                                    e.currentTarget.src = FLAG_PLACEHOLDER
                                }
                            }}
                        />
                    </div>

                    <div className="options-container">
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedAnswer === option
                            const isCorrect = option === currentQuestion.correctAnswer
                            const showCorrect = showFeedback && isCorrect
                            const showWrong = showFeedback && isSelected && !isCorrect

                            let optionClass = 'option-button'
                            if (showCorrect) optionClass += ' option-correct'
                            if (showWrong) optionClass += ' option-wrong'
                            if (!isSelected && showFeedback && !isCorrect) optionClass += ' option-inactive'
                            if (isAnswered) optionClass += ' option-disabled'

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={isAnswered}
                                    className={optionClass}
                                >
                                    <span>{option}</span>
                                    {showCorrect && <CheckCircle className="option-icon" />}
                                    {showWrong && <XCircle className="option-icon" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}