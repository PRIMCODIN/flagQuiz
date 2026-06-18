import { fetchLeaderboard, fetchUserEntries, submitLeaderboardEntry, subscribeToLeaderboardInserts } from '../api/supabaseLeaderboard'

/**
 * Inserta una entrada en el leaderboard simplificado.
 * Tabla esperada en Supabase: leaderboard_entries
 * Columnas m�nimas:
 * - id (uuid)
 * - user_id (uuid, nullable para invitados)
 * - display_name (text)
 * - score (integer)
 * - correct_answers (integer)
 * - total_questions (integer)
 * - time_seconds (integer)
 * - mode (text)
 * - created_at (timestamp with time zone, default now())
 */
export async function submitScore({
    userId,
    displayName,
    score,
    correctAnswers,
    totalQuestions,
    timeSeconds,
    mode = 'classic'
}) {
    try {
        const payload = {
            user_id: userId ?? null,
            display_name: displayName,
            score,
            correct_answers: correctAnswers,
            total_questions: totalQuestions,
            time_seconds: timeSeconds,
            mode
        }

        return await submitLeaderboardEntry(payload)
    } catch (error) {
        console.error('Error submitting score:', error)
        throw error
    }
}

/**
 * Obtiene el ranking global (opcionalmente filtrado por modo/dificultad)
 */
export async function getLeaderboard({ mode, limit = 100 } = {}) {
    try {
        const data = await fetchLeaderboard({ mode, limit })
        return data.map((entry, index) => ({
            rank: index + 1,
            displayName: entry.display_name,
            score: entry.score,
            correctAnswers: entry.correct_answers,
            totalQuestions: entry.total_questions,
            timeSeconds: entry.time_seconds,
            mode: entry.mode,
            createdAt: entry.created_at
        }))
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        throw error
    }
}

/**
 * Estad�sticas generales del juego basadas en leaderboard_entries
 */
export async function getGameStats() {
    try {
        // Reutilizamos fetchLeaderboard para mantener una sola v�a de lectura.
        // Nota: para estad�sticas globales en producci�n, convendr�a un RPC o vista agregada.
        const data = await fetchLeaderboard({ limit: 1000 })

        const totalGames = data.length
        if (totalGames === 0) {
            return {
                totalGames: 0,
                avgScore: 0,
                avgCorrect: 0,
                perfectScores: 0
            }
        }

        const avgScore = data.reduce((sum, game) => sum + game.score, 0) / totalGames
        const avgCorrect = data.reduce((sum, game) => sum + game.correct_answers, 0) / totalGames
        const perfectScores = data.filter(game => game.correct_answers === game.total_questions).length

        return {
            totalGames,
            avgScore: Math.round(avgScore),
            avgCorrect: Math.round((avgCorrect / totalGames) * 10) / 10,
            perfectScores
        }
    } catch (error) {
        console.error('Error getting game stats:', error)
        throw error
    }
}

/**
 * Suscripci�n en tiempo real a cambios en el ranking
 */
export function subscribeToRanking(callback) {
    return subscribeToLeaderboardInserts(callback)
}

export async function getUserStats(userId) {
    if (!userId) return null

    try {
        const data = await fetchUserEntries(userId, 50)
        const gamesPlayed = data.length
        if (gamesPlayed === 0) {
            return {
                gamesPlayed: 0,
                bestScore: 0,
                avgScore: 0,
                avgTimeSecondsPerGame: 0,
                recentGames: []
            }
        }

        let bestScore = 0
        let totalScore = 0
        let totalTime = 0

        data.forEach((g) => {
            if (g.score > bestScore) bestScore = g.score
            totalScore += g.score
            totalTime += g.time_seconds
        })

        const avgScore = Math.round(totalScore / gamesPlayed)
        const avgTimeSecondsPerGame = Math.round(totalTime / gamesPlayed)

        const recentGames = data.slice(0, 5).map((g) => ({
            score: g.score,
            correctAnswers: g.correct_answers,
            totalQuestions: g.total_questions,
            timeSeconds: g.time_seconds,
            mode: g.mode,
            createdAt: g.created_at
        }))

        return {
            gamesPlayed,
            bestScore,
            avgScore,
            avgTimeSecondsPerGame,
            recentGames
        }
    } catch (error) {
        console.error('Error getting user stats:', error)
        throw error
    }
}
