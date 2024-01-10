import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function AdminUser() {
  const [user, setUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const token = localStorage.getItem("jwt")

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users")

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setProfiles(data)
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs :",
        error.message
      )
    }
  }

  useEffect(() => {
    fetchAllUsers()

    if (token) {
      const decodedData = jwtDecode(token)
      setUser(decodedData)
    }
  }, [])

  const handleDeleteProfile = async (id) => {
    if (
      window.confirm(
        "Voulez-vous supprimer cet utilisateur ? Cette action est irréversible !"
      )
    ) {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        if (response.ok) {
          window.location.reload()
        } else {
          console.error(
            "Échec lors de la suppression de l'utilisateur :",
            response.statusText
          )

          alert("La suppression de l'utilisateur a échoué. Veuillez réessayer.")
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur")
        console.log(error.message)
      }
    }
  }

  return (
    <>
      <ul>
        <div className="userContainerAdmin">
          <li>Identifiant :</li>
          <li>Pseudo :</li>
          <li>           </li>
          <li>           </li>
        </div>
        {profiles.map((profile, index) => (
          <div key={index} className="userContainerAdmin">
            <li>{profile.id}</li>
            <li>
              <Link
                to={"/profile/" + profile.id}
                className="commentAuthor admin"
              >
                @{profile.username}
              </Link>
            </li>
            <li>
              {parseInt(user.dataRole) <= parseInt(profile.RoleId) ? (
                <Link className="editLink" to={`edit/${profile.id}`}>
                  Modifier le profil
                </Link>
              ) : (
                <p className="editLink">Super-administrateur</p>
              )}
            </li>
            <li>
              {parseInt(user.dataRole) <= parseInt(profile.RoleId) ? (
                <p
                  className="deleteLink"
                  onClick={() => handleDeleteProfile(profile.id)}
                >
                  Supprimer le profil
                </p>
              ) : null}
            </li>
            {console.log(user.dataRole, profile.RoleId)}
          </div>
        ))}
      </ul>
    </>
  )
}

export default AdminUser
