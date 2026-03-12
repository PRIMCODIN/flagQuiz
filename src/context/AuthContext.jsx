/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../config/supabase'
import { getOrCreateProfile } from '../api/supabaseProfiles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadProfile = useCallback(async (authUser) => {
        if (!authUser) {
            setProfile(null)
            return
        }

        try {
            const username =
                authUser.user_metadata?.username ||
                authUser.user_metadata?.display_name ||
                authUser.email?.split('@')[0] ||
                'player'

            const row = await getOrCreateProfile({
                id: authUser.id,
                username,
                email: authUser.email ?? null
            })

            setProfile({
                id: row.id,
                username: row.username,
                displayName: row.display_name || row.username,
                isGuest: false
            })
        } catch (err) {
            console.error('Error loading profile:', err)
            setProfile({
                id: authUser.id,
                username: authUser.email || 'player',
                displayName: authUser.email || 'Jugador',
                isGuest: false
            })
        }
    }, [])

    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await supabase.auth.getSession()
                const currentUser = data.session?.user ?? null
                setUser(currentUser)

                if (currentUser) {
                    await loadProfile(currentUser)
                } else {
                    const storedGuest = localStorage.getItem('guestProfile')
                    if (storedGuest) {
                        const parsed = JSON.parse(storedGuest)
                        setProfile(parsed)
                    }
                }
            } catch (err) {
                console.error('Error initializing auth:', err)
            } finally {
                setLoading(false)
            }
        }

        init()

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const authUser = session?.user ?? null
            setUser(authUser)

            if (authUser) {
                localStorage.removeItem('guestProfile')
                await loadProfile(authUser)
            } else {
                setProfile(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [loadProfile])

    const signUp = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        })

        if (error) throw error

        if (data.user) {
            await loadProfile(data.user)
        }

        return data
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        if (data.user) {
            await loadProfile(data.user)
        }

        return data
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    const continueAsGuest = (displayName) => {
        const guestProfile = {
            id: `guest-${crypto.randomUUID()}`,
            displayName: displayName.trim(),
            isGuest: true
        }
        setUser(null)
        setProfile(guestProfile)
        localStorage.setItem('guestProfile', JSON.stringify(guestProfile))
        return guestProfile
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        continueAsGuest
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return ctx
}

