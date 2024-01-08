import "./App.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import HomeApp from "./pages/HomeApp"
import DiscoverApp from "./pages/DiscoverApp"
import CommunityApp from "./pages/CommunityApp"
import AccountApp from "./pages/AccountApp"
import ProfilePage from "./pages/ProfilePage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Je vérifie si un token est déjà présent
    const token = localStorage.getItem("jwt")

    if (token) {
      // Décodage du token pour obtenir les informations d'authentification
      const decodedToken = jwtDecode(token)

      // Mise à jour l'état de l'utilisateur avec les informations d'authentification
      setUser(decodedToken)
      setIsLoggedIn(true)
      return console.log(isLoggedIn)
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const redirectToLogin = () => <Navigate to="/login" />
  const redirectToHome = () => <Navigate to="/index" />

  return (
    <Router>
      <Routes>
        {/* Redirection en fonction de l'état isLoggedIn */}
        {!isLoggedIn && <Route path="/*" element={redirectToLogin} />}
        {isLoggedIn && <Route path="*" element={redirectToHome} />}
        {isLoggedIn && <Route path="/login" element={redirectToHome} />}

        {/* Pages pour les utilisateurs connectés */}
        {isLoggedIn && (
          <>
            <Route path="/index" element={<HomeApp />} />
            <Route path="/discover" element={<DiscoverApp />} />
            <Route path="/community" element={<CommunityApp />} />
            <Route
              path="/account"
              element={<AccountApp onLogout={handleLogout} />}
            />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </>
        )}

        {/* Page de connexion uniquement pour les utilisateurs non connectés */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<Register loginThroughRegister={handleLogin} />}
            />
          </>
        )}

        {/* Redirection pour l'URL sans "/" à la fin */}
        {!isLoggedIn && <Route path="" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  )
}

export default App
