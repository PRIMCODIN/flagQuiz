export const WORLD_LEVELS = [
    {
        id: 'wp-1',
        name: 'Europa fácil',
        continent: 'Europe',
        difficulty: 'easy'
    },
    {
        id: 'wp-2',
        name: 'América fácil',
        continent: 'America',
        difficulty: 'easy'
    },
    {
        id: 'wp-3',
        name: 'Asia normal',
        continent: 'Asia',
        difficulty: 'normal'
    },
    {
        id: 'wp-4',
        name: 'África normal',
        continent: 'Africa',
        difficulty: 'normal'
    },
    {
        id: 'wp-5',
        name: 'Oceania difícil',
        continent: 'Oceania',
        difficulty: 'hard'
    },
    {
        id: 'wp-6',
        name: 'Hardcore mundial',
        continent: 'World',
        difficulty: 'hard'
    }
]

export function getWorldPathProgressKey(profileId) {
    return `worldPathProgress:${profileId || 'guest'}`
}

export function loadWorldPathProgress(profileId) {
    const key = getWorldPathProgressKey(profileId)
    try {
        return JSON.parse(localStorage.getItem(key) || '{}')
    } catch {
        return {}
    }
}

export function markLevelCompleted(profileId, levelId) {
    const key = getWorldPathProgressKey(profileId)
    const current = loadWorldPathProgress(profileId)
    const next = { ...current, [levelId]: true }
    localStorage.setItem(key, JSON.stringify(next))
    return next
}

