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
import AdminPage from "./pages/AdminPage"
import AdminComment from "./components/AdminComment"
import AdminReview from "./components/AdminReview"
import AdminUser from "./components/AdminUser"
import AdminEdit from "./components/AdminEdit"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
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
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  useEffect(() => {
    if (user && parseInt(user.dataRole) < 3) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user, isLoggedIn])

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <Router>
      <Routes>
        {/* Redirection en fonction de l'état isLoggedIn */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
        {isLoggedIn && <Route path="" element={<Navigate to="/index" />} />}
        {isLoggedIn && (
          <Route path="/login" element={<Navigate to="/index" />} />
        )}

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
            {isAdmin ? (
              <>
                <Route path="/admin" element={<AdminPage />}>
                  <Route path="/admin/comment" element={<AdminComment />} />
                  <Route path="/admin/user" element={<AdminUser />} />
                  <Route path="/admin/review" element={<AdminReview />} />
                </Route>
                <Route path="/admin/user/edit/:id" element={<AdminEdit />} />
              </>
            ) : (
              <Route path="/admin" element={<Navigate to="/index" />} />
            )}
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
      </Routes>
    </Router>
  )
}

export default App
