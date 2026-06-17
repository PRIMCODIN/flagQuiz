import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege las rutas de juego: requiere una sesión (usuario autenticado o
 * invitado). Mientras se resuelve el estado de autenticación muestra un
 * spinner para evitar un parpadeo hacia el login. Si no hay perfil, redirige
 * a la pantalla de inicio.
 */
export default function ProtectedRoute() {
    const { profile, loading } = useAuth()

    if (loading) {
        return (
            <div className="game-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Cargando…</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
