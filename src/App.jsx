import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginScreen from './screens/LoginScreen'
import ModeSelectScreen from './screens/ModeSelectScreen'
import WorldPathScreen from './screens/WorldPathScreen'
import FreeModeScreen from './screens/FreeModeScreen'
import ProfileScreen from './screens/ProfileScreen'
import GameScreen from './screens/GameScreen'
import ResultsScreen from './screens/ResultsScreen'
import RankingScreen from './screens/RankingScreen'
import PublicRankingScreen from './screens/PublicRankingScreen'

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="/modes" element={<ModeSelectScreen />} />
                    <Route path="/world-path" element={<WorldPathScreen />} />
                    <Route path="/free-mode" element={<FreeModeScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/game" element={<GameScreen />} />
                    <Route path="/results" element={<ResultsScreen />} />
                    <Route path="/ranking" element={<RankingScreen />} />
                    <Route path="/public-rankings" element={<PublicRankingScreen />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 3000,
                        className: 'toast-notification',
                        success: {
                            className: 'toast-success',
                        },
                        error: {
                            className: 'toast-error',
                        },
                    }}
                />
            </div>
        </Router>
    )
}

export default App