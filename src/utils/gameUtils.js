/**
 * Genera un conjunto aleatorio de preguntas del juego
 * @param {Array} flagsData - Array completo de banderas
 * @param {number} numQuestions - Número de preguntas a generar (default: 12)
 * @returns {Array} Array de preguntas con opciones aleatorias
 */
export function generateQuestions(flagsData, numQuestions = 12, config = {}) {
    const continent = config.continent || 'World'
    const difficulty = config.difficulty || 'normal'

    const pool = buildFlagPool(flagsData, { continent, difficulty })

    // Mezclar pool aleatoriamente
    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    // Tomar las primeras N banderas
    const selectedFlags = shuffled.slice(0, numQuestions)

    // Para cada bandera, generar 4 opciones únicas
    return selectedFlags.map(flag => ({
        id: flag.id,
        flagUrl: flag.flag,
        correctAnswer: flag.country,
        continent: flag.continent,
        options: generateOptions(flag, flagsData)
    }))
}

/**
 * Genera 4 opciones de respuesta para una bandera (1 correcta + 3 incorrectas)
 * Prioriza países del mismo continente para aumentar dificultad
 */
function generateOptions(correctFlag, allFlags) {
    // Filtrar países del mismo continente (excluyendo la correcta)
    const sameContinent = allFlags.filter(f =>
        f.continent === correctFlag.continent &&
        f.id !== correctFlag.id
    )

    // Si hay suficientes países del mismo continente, usar esos
    let wrongAnswers
    if (sameContinent.length >= 3) {
        wrongAnswers = sameContinent
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(f => f.country)
    } else {
        // Si no hay suficientes, mezclar con países de otros continentes
        const otherCountries = allFlags.filter(f => f.id !== correctFlag.id)
        wrongAnswers = otherCountries
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(f => f.country)
    }

    // Mezclar la respuesta correcta con las incorrectas
    const allOptions = [correctFlag.country, ...wrongAnswers]
    return allOptions.sort(() => Math.random() - 0.5)
}

function buildFlagPool(allFlags, { continent, difficulty }) {
    let pool = [...allFlags]

    if (continent && continent !== 'World') {
        pool = pool.filter((f) => f.continent === continent)
    }

    // Heurística simple para "easy": filtra territorios y nombres típicamente difíciles.
    // Si el filtro deja pocas banderas, hacemos fallback al pool original.
    if (difficulty === 'easy') {
        const easy = pool.filter((f) => isLikelyCommonFlag(f.country))
        if (easy.length >= Math.min(60, pool.length * 0.4)) {
            pool = easy
        }
    }

    // hard incluye todo el pool seleccionado
    return pool
}

function isLikelyCommonFlag(countryName) {
    const name = (countryName || '').toLowerCase()
    const hardKeywords = [
        'island',
        'islands',
        'territory',
        'republic',
        'french',
        'british',
        'saint',
        'st.',
        'northern',
        'southern',
        'united states minor outlying',
        'wallis',
        'futuna',
        'virgin',
        'cayman',
        'turks',
        'caicos',
        'guadeloupe',
        'martinique',
        'mayotte',
        'réunion',
        'bouvet',
        'heard',
        'mcdonald',
        'pitcairn',
        'cocos',
        'christmas',
        'svalbard',
        'jan mayen',
        'tokelau',
        'niue',
        'gibraltar',
        'jersey',
        'guernsey',
        'isle of man',
        'aruba',
        'curaçao',
        'bonaire',
        'sint',
        'saint',
        'falkland',
        'georgia',
        'antarctica',
        'palau',
        'micronesia',
        'marshall'
    ]

    if (hardKeywords.some((k) => name.includes(k))) return false
    if (name.length >= 28) return false
    return true
}

/**
 * Calcula la puntuación por respuesta correcta
 * @param {number} timeRemaining - Segundos restantes cuando respondió
 * @returns {number} Puntuación total
 */
export function calculateScore(timeRemaining) {
    const basePoints = 100
    const timeBonus = Math.max(0, timeRemaining) * 10 // 10 puntos por segundo sobrante
    return basePoints + timeBonus
}

/**
 * Calcula la puntuación total del juego
 */
export function getTotalScore(answers) {
    return answers.reduce((total, answer) => {
        if (answer.isCorrect) {
            return total + calculateScore(answer.timeRemaining)
        }
        return total
    }, 0)
}

/**
 * Genera un código único de premio
 * Formato: [LETRA]-[5 DÍGITOS]
 * Ejemplo: A-12345, M-98732
 */
export function generatePrizeCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    const randomNumbers = Math.floor(10000 + Math.random() * 90000) // Genera número entre 10000-99999
    return `${randomLetter}-${randomNumbers}`
}

/**
 * Formatea el tiempo en segundos a formato mm:ss
 */
export function formatTime(seconds) {
    if (!Number.isFinite(seconds)) seconds = 0
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Valida que el nombre de usuario sea válido.
 * Regla única: 3-20 caracteres, solo letras (a-z), números y guiones bajos,
 * sin espacios. Se aplica tanto a usuarios registrados como a invitados.
 */
export function isValidUsername(username) {
    if (!username) return false
    const value = username.trim()
    if (value.length < GAME_CONFIG.MIN_USERNAME_LENGTH) return false
    if (value.length > GAME_CONFIG.MAX_USERNAME_LENGTH) return false
    return /^[a-zA-Z0-9_]+$/.test(value)
}

/**
 * Configuración del juego
 */
export const GAME_CONFIG = {
    NUM_QUESTIONS: 12,
    TIME_PER_QUESTION: 15, // segundos
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20
}