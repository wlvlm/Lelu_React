import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Modal from "react-modal"
import { FaStar } from "react-icons/fa"

const BookCard = ({ book, comments, likes, ratingAverage }) => {
  const heartFilled = require("../assets/img/heartFilled.png")
  const heartStroke = require("../assets/img/heartStroke.png")
  const [value, setValue] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(0)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem("jwt")
  const decodedToken = jwtDecode(token)

  const handleDeleteComment = async (commentId, commentUserId) => {
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
        console.log("fetch effectué sur : " + commentId)
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

  const handlePostComment = async (event, bookId) => {
    event.preventDefault()
    setValue(event.target.value)

    const commentToPost = {
      content: value,
      UserId: decodedToken.id,
      bookId: bookId,
    }

    try {
      const response = await fetch("http://localhost:3001/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(commentToPost),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        console.error(
          "Échec lors de la création du commentaire :",
          response.statusText
        )

        alert("La création du commentaire a échoué. Veuillez réessayer.")
      }
    } catch (error) {
      console.error("Erreur : " + error.message)
    }
  }

  const handleLike = async () => {
    if (!isLiked) {
      try {
        const response = await fetch("http://localhost:3001/api/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            bookId: book.id,
          }),
        })

        if (response.ok) {
          setIsLiked(true)
          setCurrentLikes((prevLikes) => prevLikes + 1)
          localStorage.setItem(`isLiked_${book.id}`, "true")
        } else {
          console.error("Erreur lors de l'ajout du like :", response.statusText)
        }
      } catch (error) {
        console.error("Erreur lors de la requête d'ajout de like :", error)
      }
    }
  }

  const handleDislike = async () => {
    if (isLiked) {
      try {
        const response = await fetch("http://localhost:3001/api/likes", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            bookId: book.id,
          }),
        })

        if (response.ok) {
          setIsLiked(false)
          setCurrentLikes((prevLikes) => prevLikes - 1)
          localStorage.setItem(`isLiked_${book.id}`, "false")
        } else {
          console.error(
            "Erreur lors de la suppression du like :",
            response.statusText
          )
        }
      } catch (error) {
        console.error(
          "Erreur lors de la requête de suppression de like :",
          error
        )
      }
    }
  }

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const handleReviewPost = async (event, bookId, rating) => {
    event.preventDefault()
    const reviewData = {
      content: event.target.content.value,
      bookId: bookId,
      userId: decodedToken.dataId,
      rating: rating,
    }

    try {
      const response = await fetch("http://localhost:3001/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(reviewData),
      })

      const postReview = await response.json()

      if (response.ok) {
        window.location.reload()
      } else {
        if (postReview.data === "Review exists") {
          navigate("/edit/review")
        } else {
          console.error("Échec lors de la création de l'avis :", postReview)
          alert("La création de l'avis a échoué. Veuillez réessayer.")
        }
      }
    } catch (error) {
      console.error("Erreur : " + error.message)
    }
  }

  useEffect(() => {
    const storedIsLiked = localStorage.getItem(`isLiked_${book.id}`)
    setIsLiked(storedIsLiked === "true")
    setCurrentLikes(likes[book.id] || 0)
  }, [likes, book.id])

  const formatLikes = (likes) => {
    if (likes < 1000) {
      return likes.toString()
    } else {
      const kLikes = (likes / 1000).toFixed(1)
      const decimalPart = kLikes.split(".")[1]
      return decimalPart === "0" ? `${Math.floor(kLikes)} k` : `${kLikes} k`
    }
  }

  const getStarRating = (averageRating) => {
    const starRating = Math.round(averageRating * 2) / 2
    return starRating
  }

  const starRating = getStarRating(ratingAverage[book.id])

  return (
    <div className="card">
      <div className="leftSide">
        <h2 className="title" data-title={book.title}>
          {book.title}
        </h2>
        <h4 className="isbn">ISBN: {book.isbn}</h4>
        <h4 className="bookAuthor">Auteur: {book.author}</h4>
        <div className="rating">
          <p className="average">Moyenne totale :</p>
          <h2 className="title ratingTitle">{ratingAverage[book.id]}</h2>
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
                    color={currentRating <= starRating ? "ffc107" : "#e4e5e9"}
                  />
                </label>
              )
            })}
          </div>
          <button className="ratingButton" onClick={openModal}>
            Noter
          </button>
        </div>
        <img src={book.coverUrl} alt={book.title} />
        <div className="imgContainer"></div>
      </div>
      <div className="rightSide">
        {comments && comments.length > 0 ? (
          <ul className="commentWrapper">
            {comments.map((comment, index) => (
              <div className="commentContainer" key={index}>
                <li>
                  <Link
                    to={"/profile/" + comment.User.id}
                    className="commentAuthor"
                  >
                    @{comment.User.username} :
                  </Link>
                </li>
                <li className="commentContent">{comment.content}</li>
                {parseInt(comment.User.id) === parseInt(decodedToken.dataId) ? (
                  <li className="deleteButton">
                    <button
                      onClick={() =>
                        handleDeleteComment(comment.id, comment.UserId)
                      }
                    >
                      Supprimer
                    </button>
                  </li>
                ) : null}
              </div>
            ))}
          </ul>
        ) : (
          <p>Aucun commentaire sur ce livre !</p>
        )}
        <div className="interactionContainer">
          <form onSubmit={(event) => handlePostComment(event, book.id)}>
            <input
              placeholder="Poster un commentaire"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              name="postComment"
              className="postComment"
            />
          </form>
          <div style={{ width: "15%" }}>
            <button
              className="like"
              onClick={isLiked ? handleDislike : handleLike}
            >
              {isLiked ? (
                <img className="likeImg" alt="like" src={heartFilled} />
              ) : (
                <img className="likeImg" alt="like" src={heartStroke} />
              )}
            </button>
            <p className="likes">{formatLikes(currentLikes)}</p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Rating"
        className="modalRating"
        overlayClassName="modalOverlay"
      >
        <div>
          <h2 className="title" data-title={book.title}>
            {book.title}
          </h2>
          <h4 className="isbn">ISBN: {book.isbn}</h4>
          <h4 className="bookAuthor">Auteur: {book.author}</h4>
          <div className="ratingCover">
            <img className="modalCover" src={book.coverUrl} alt={book.title} />
            <div className="rating modal">
              <p className="average">Moyenne totale :</p>
              <h2 className="titleModal">{ratingAverage[book.id]}</h2>
              <div className="starContainer">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1
                  return (
                    <label>
                      <input
                        type="radio"
                        required
                        name="rating"
                        value={currentRating}
                        onClick={() => {
                          setRating(currentRating)
                        }}
                      />
                      <FaStar
                        className="star"
                        size={25}
                        color={
                          currentRating <= (hover || rating)
                            ? "ffc107"
                            : "#e4e5e9"
                        }
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={(event) => handleReviewPost(event, book.id, rating)}>
          <textarea required name="content" className="modalInput"></textarea>
          <input className="ratingButton" type="submit" value="Poster" />
        </form>
        <button onClick={closeModal}>Fermer</button>
      </Modal>
    </div>
  )
}

export default BookCard
