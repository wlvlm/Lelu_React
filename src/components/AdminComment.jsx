import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function AdminComment() {
  const [comments, setComments] = useState([])
  const token = localStorage.getItem("jwt")

  function formatDateToFrench(dateString) {
    const optionsDate = { day: "numeric", month: "numeric", year: "numeric" }
    const optionsTime = { hour: "numeric", minute: "numeric" }

    const dateObject = new Date(dateString)
    const formattedDate = dateObject.toLocaleDateString("fr-FR", optionsDate)
    const formattedTime = dateObject.toLocaleTimeString("fr-FR", optionsTime)

    const formattedDateTime = `Le ${formattedDate} à ${formattedTime}`

    return formattedDateTime
  }

  const fetchAllComments = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/comments")

      const data = await response.json()
      if (Array.isArray(data.data) && data.data.length > 0) {
        setComments(data.data)
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commentaires :",
        error.message
      )
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Voulez-vous supprimer le commentaire ?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
        if (response.ok) {
          window.location.reload()
        } else {
          console.error(
            "Échec lors de la suppression du commentaire :",
            response.statusText
          )

          alert("La suppression du commentaire a échoué. Veuillez réessayer.")
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire")
        console.log(error.message)
      }
    }
  }

  useEffect(() => {
    fetchAllComments()
  }, [])

  return (
    <>
      <ul>
        <div className="userContainerAdmin">
          <li>Utilisateur :</li>
          <li>Commentaire :</li>
          <li>Dernière modification :</li>
          <li>           </li>
        </div>
        {comments.map((comment, index) => (
          <div className="userContainerAdmin">
            <li>
              <Link
                to={"/profile/" + comment.User.id}
                className="commentAuthor admin"
              >
                @{comment.User.username}
              </Link>
            </li>
            <li>{comment.content} </li>
            <li className="commentDateAdmin">
              {formatDateToFrench(comment.updatedAt)}
            </li>
            <li>
              <p
                className="deleteLink"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Supprimer
              </p>
            </li>
          </div>
        ))}
      </ul>
    </>
  )
}

export default AdminComment
