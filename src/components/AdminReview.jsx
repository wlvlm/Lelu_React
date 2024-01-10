import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa"

function AdminReview() {
  const [reviews, setReviews] = useState([])
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

  const fetchAllReviews = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/review")

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error.message)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Voulez-vous supprimer l'avis ?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/review/${reviewId}`,
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
            "Échec lors de la suppression de l'avis :",
            response.statusText
          )

          alert("La suppression de l'avis a échoué. Veuillez réessayer.")
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'avis")
        console.log(error.message)
      }
    }
  }

  useEffect(() => {
    fetchAllReviews()
  }, [])

  return (
    <>
      <ul>
        <div className="userContainerAdmin">
          <li>Utilisateur :</li>
          <li>Avis :</li>
          <li>Dernière modification :</li>
          <li>           </li>
        </div>
        {reviews.map((review, index) => (
          <div className="userContainerAdmin">
            <li>
              <Link
                to={"/profile/" + review.User.id}
                className="commentAuthor admin"
              >
                @{review.User.username}
              </Link>
            </li>
            <li>
              {review.content}
              <div className="starContainer">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        required
                        name="rating"
                        value={currentRating}
                      />
                      <FaStar
                        className="star model"
                        size={25}
                        color={
                          currentRating <= review.rating ? "ffc107" : "#e4e5e9"
                        }
                      />
                    </label>
                  )
                })}
              </div>
            </li>
            <li className="commentDateAdmin">
              {formatDateToFrench(review.updatedAt)}
            </li>
            <li>
              <p
                className="deleteLink"
                onClick={() => handleDeleteReview(review.id)}
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

export default AdminReview
