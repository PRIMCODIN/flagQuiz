import { supabase } from '../config/supabase'

export async function submitLeaderboardEntry(payload) {
    const { data, error } = await supabase
        .from('leaderboard_entries')
        .insert([payload])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function fetchLeaderboard({ mode, limit = 100 } = {}) {
    let query = supabase
        .from('leaderboard_entries')
        .select('id, display_name, score, correct_answers, total_questions, time_seconds, mode, created_at')
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(limit)

    if (mode && mode !== 'all') {
        query = query.eq('mode', mode)
    }

    const { data, error } = await query
    if (error) throw error
    return data
}

export function subscribeToLeaderboardInserts(callback) {
    return supabase
        .channel('leaderboard-changes')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'leaderboard_entries' },
            callback
        )
        .subscribe()
}

export async function fetchUserEntries(userId, limit = 50) {
    const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('score, correct_answers, total_questions, time_seconds, mode, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data
}


