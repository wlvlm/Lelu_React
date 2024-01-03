// import Home from "./Home"
import Navbar from "../components/Navbar/Navbar"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function AccountApp({ onLogout }) {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState("")

  const handleLogout = () => {
    // sortir le token du local storage
    localStorage.removeItem("jwt")

    // redirige l'utilisateur vers la page de login
    onLogout()
    navigate("/login")
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt")

    if (!token) {
      navigate("/login")
    } else {
      const decodedToken = jwtDecode(token)
      setUserEmail(decodedToken)
      console.log("Token décodé :", decodedToken)
    }
  }, [navigate])

  return (
    <>
      <Navbar />
      <h1>Mon Compte</h1>
      <h2>{userEmail.dataEmail}</h2>
      <h2>{userEmail.dataPassword}</h2>
      <h2>{userEmail.dataRole}</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
    </>
  )
}

export default AccountApp
