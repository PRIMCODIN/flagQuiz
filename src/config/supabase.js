import { createClient } from '@supabase/supabase-js'

// IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage,
        storageKey: 'flagchallenge-auth'
    }
})