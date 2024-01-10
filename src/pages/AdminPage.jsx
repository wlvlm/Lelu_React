import React from "react"
import { Link, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

function AdminPage() {
  return (
    <div className="container admin">
      <Navbar />
      <h1>Administration</h1>
      <div className="adminWrapper">
        <Link to="/admin/user">Utilisateurs</Link>
        <Link to="/admin/comment">Commentaires</Link>
        <Link to="/admin/review">Avis</Link>
      </div>
      <Outlet />
    </div>
  )
}

export default AdminPage
