import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function AdminEdit() {
  const { id } = useParams()
  const [user, setUser] = useState("")
  const [profile, setProfile] = useState("")
  const [updateData, setUpdateData] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("jwt")

  useEffect(() => {
    const fetchProfile = async (id) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`)
        const data = await response.json()

        if (data.data) {
          const userData = { ...data.data }
          setProfile(userData)
        } else {
          navigate("/index")
          alert(`Aucun profil n'existe pour l'id ${id}, retour à l'accueil...`)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
      }
    }

    fetchProfile(id)

    if (token) {
      const decodedData = jwtDecode(token)
      setUser(decodedData)
    }
    console.log(profile)
  }, [id])

  const handleUpdate = (event, username, role) => {
    setUpdateData({
      username: username,
      RoleId: role,
    })

    const updateProfile = async (id) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(updateData),
        })

        if (response.ok) {
          navigate("/admin/user")
        } else {
          console.error(
            "Échec lors de la mise à jour de l'utilisateur :",
            response.statusText
          )
          alert(
            "La mise à jour de l'utilisateur  a échoué. Veuillez réessayer."
          )
        }
      } catch (error) {}
    }

    const id = profile.id

    updateProfile(id)

    return console.log(updateData)
  }

  return (
    <div className="container admin">
      <h1>Administration</h1>
      <Link to="/admin/user">Retour</Link>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleUpdate(
            event,
            event.target.pseudo.value,
            event.target.role.value
          )
        }}
      >
        <input type="text" name="pseudo" defaultValue={profile.username} />
        {parseInt(user.dataRole) <= parseInt(profile.RoleId) && (
          <select name="role" defaultValue={profile.RoleId} required>
            {user.dataRole === 1 ? <option value="1">Superadmin</option> : null}
            <option value="2">Admin</option>
            <option value="3">Lecteur</option>
          </select>
        )}
        <input type="submit" value="Mettre à jour" />
      </form>
    </div>
  )
}

export default AdminEdit
