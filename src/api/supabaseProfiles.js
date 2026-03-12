import { supabase } from '../config/supabase'

export async function fetchProfileById(id) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
}

export async function createProfile({ id, username, email }) {
    const payload = {
        id,
        username,
        display_name: username,
        email
    }

    const { data, error } = await supabase
        .from('profiles')
        .insert([payload])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getOrCreateProfile({ id, username, email }) {
    const existing = await fetchProfileById(id)
    if (existing) return existing
    return await createProfile({ id, username, email })
}

export async function getEmailForUsername(username) {
    const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .maybeSingle()

    if (error) throw error
    if (!data?.email) {
        throw new Error('No existe ningún usuario con ese nombre.')
    }
    return data.email
}

