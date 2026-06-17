import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidUsername } from '../utils/gameUtils'
import { useAuth } from '../context/AuthContext'
import { getEmailForUsername } from '../api/supabaseProfiles'
import CompassRose from '../components/CompassRose'

const TAB_LOGIN = 'login'
const TAB_SIGNUP = 'signup'
const TAB_GUEST = 'guest'

export default function LoginScreen() {
    const navigate = useNavigate()
    const { signIn, signUp, continueAsGuest, loading } = useAuth()

    const [activeTab, setActiveTab] = useState(TAB_LOGIN)
    const [identifier, setIdentifier] = useState('') // email o username
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [guestName, setGuestName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isBusy = loading || isSubmitting

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!identifier || !password) {
            toast.error('Introduce tu usuario/email y contraseña')
            return
        }

        setIsSubmitting(true)
        try {
            let emailToUse = identifier.trim()

            if (!emailToUse.includes('@')) {
                // Se ha introducido un username: resolvemos su email
                emailToUse = await getEmailForUsername(emailToUse)
            }

            await signIn(emailToUse, password)
            toast.success('Sesión iniciada. ¡A jugar!')
            navigate('/modes')
        } catch (err) {
            console.error('Error en login:', err)
            toast.error(err.message || 'Error al iniciar sesión')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()

        if (!isValidUsername(username)) {
            toast.error('El usuario debe tener entre 3 y 20 caracteres: solo letras, números y guiones bajos, sin espacios')
            return
        }

        if (!email || !password) {
            toast.error('Introduce un email y contraseña válidos')
            return
        }

        setIsSubmitting(true)
        try {
            await signUp(email.trim(), password, username.trim())
            toast.success('Cuenta creada. Revisa tu email si se requiere confirmación.')
            navigate('/modes')
        } catch (err) {
            console.error('Error en registro:', err)
            toast.error(err.message || 'Error al crear la cuenta')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGuest = async (e) => {
        e.preventDefault()

        if (!isValidUsername(guestName)) {
            toast.error('El nombre debe tener entre 3 y 20 caracteres: solo letras, números y guiones bajos, sin espacios')
            return
        }

        try {
            continueAsGuest(guestName.trim())
            toast.success('Entrando como invitado')
            navigate('/modes')
        } catch (err) {
            console.error('Error en modo invitado:', err)
            toast.error('No se pudo iniciar como invitado')
        }
    }

    const goToRankings = () => {
        navigate('/public-rankings')
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <aside className="login-brand">
                    <div className="logo-container">
                        <CompassRose />
                    </div>
                    <h1 className="login-title">Flag Challenge</h1>
                    <p className="login-subtitle">Pon a prueba tus conocimientos de banderas</p>

                    <ul className="login-features">
                        <li className="info-item">
                            <span className="status-dot"></span>
                            +250 banderas del mundo
                        </li>
                        <li className="info-item">
                            <span className="status-dot"></span>
                            15 segundos por pregunta
                        </li>
                        <li className="info-item">
                            <span className="status-dot"></span>
                            Ranking en tiempo real
                        </li>
                    </ul>
                </aside>

                <div className="login-panel">
                    <p className="login-description">Inicia sesión, crea tu cuenta o juega como invitado.</p>

                    <div className="login-tabs">
                    <button
                        type="button"
                        className={`login-tab ${activeTab === TAB_LOGIN ? 'login-tab-active' : ''}`}
                        onClick={() => setActiveTab(TAB_LOGIN)}
                        disabled={isBusy}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        type="button"
                        className={`login-tab ${activeTab === TAB_SIGNUP ? 'login-tab-active' : ''}`}
                        onClick={() => setActiveTab(TAB_SIGNUP)}
                        disabled={isBusy}
                    >
                        Crear cuenta
                    </button>
                    <button
                        type="button"
                        className={`login-tab ${activeTab === TAB_GUEST ? 'login-tab-active' : ''}`}
                        onClick={() => setActiveTab(TAB_GUEST)}
                        disabled={isBusy}
                    >
                        Invitado
                    </button>
                </div>

                {activeTab === TAB_LOGIN && (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label className="form-label">
                                <Mail className="label-icon" />
                                Usuario o email
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="tuusuario o ejemplo@correo.com"
                                className="form-input"
                                disabled={isBusy}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Lock className="label-icon" />
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="form-input"
                                disabled={isBusy}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy || !identifier || !password}
                            className="submit-button"
                        >
                            {isBusy ? 'Cargando...' : '¡JUGAR AHORA!'}
                        </button>
                    </form>
                )}

                {activeTab === TAB_SIGNUP && (
                    <form onSubmit={handleSignup} className="login-form">
                        <div className="form-group">
                            <label className="form-label">
                                <User className="label-icon" />
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tu nombre de usuario"
                                className="form-input"
                                maxLength={20}
                                disabled={isBusy}
                            />
                            <p className="form-hint">3-20 caracteres: letras, números y guiones bajos, sin espacios</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Mail className="label-icon" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                className="form-input"
                                disabled={isBusy}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Lock className="label-icon" />
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="form-input"
                                disabled={isBusy}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy || !email || !password || !username}
                            className="submit-button"
                        >
                            {isBusy ? 'Creando cuenta...' : 'Crear cuenta y jugar'}
                        </button>
                    </form>
                )}

                {activeTab === TAB_GUEST && (
                    <form onSubmit={handleGuest} className="login-form">
                        <div className="form-group">
                            <label className="form-label">
                                <User className="label-icon" />
                                Tu nombre
                            </label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Tu nombre de usuario"
                                className="form-input"
                                maxLength={20}
                                disabled={isBusy}
                            />
                            <p className="form-hint">3-20 caracteres, sin espacios. Se usará en el ranking.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy || !guestName}
                            className="submit-button"
                        >
                            {isBusy ? 'Entrando...' : 'Jugar como invitado'}
                        </button>
                    </form>
                )}

                    <div className="login-actions">
                        <button
                            onClick={goToRankings}
                            className="rankings-link-button"
                            type="button"
                        >
                            <Trophy className="rankings-link-icon" />
                            Ver Clasificación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}