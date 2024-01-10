import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { jwtDecode } from "jwt-decode"
import { FaStar, FaTrash } from "react-icons/fa"

function AccountApp({ onLogout }) {
  const [user, setUser] = useState({})
  const [comments, setComments] = useState([])
  const [changing, setChanging] = useState(false)
  const [selectedComment, setSelectedComment] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)
  const [updateComment, setUpdateComment] = useState("")
  const [updateReview, setUpdateReview] = useState("")
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  const [review, setReview] = useState(null)
  const [books, setBooks] = useState({})
  const [booksRatings, setBooksRatings] = useState({})
  const [displayComments, setDisplayComments] = useState(true)
  const [displayReviews, setDisplayReviews] = useState(false)

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("jwt")
    onLogout()
    navigate("/login")
  }

  const token = localStorage.getItem("jwt")

  const fetchCommentById = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/comments/user/${id}`
      )
      const data = await response.json()

      if (Array.isArray(data.data) && data.data.length > 0) {
        setComments(data.data)
        // Récupération des livres associés aux commentaires
        const bookIds = data.data.map((comment) => comment.bookId)
        fetchBooksByCommentIds(bookIds)
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commentaires :",
        error.message
      )
    }
  }

  const fetchRatingByUserId = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/review/user/${id}`
      )
      const ratingData = await response.json()
      if (Array.isArray(ratingData.data) && ratingData.data.length > 0) {
        setReview(ratingData.data)

        const bookIds = ratingData.data.map((review) => review.bookId)
        fetchBooksByRatingIds(bookIds)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  function formatDateToFrench(dateString) {
    const optionsDate = { day: "numeric", month: "numeric", year: "numeric" }
    const optionsTime = { hour: "numeric", minute: "numeric" }

    const dateObject = new Date(dateString)
    const formattedDate = dateObject.toLocaleDateString("fr-FR", optionsDate)
    const formattedTime = dateObject.toLocaleTimeString("fr-FR", optionsTime)

    const formattedDateTime = `Le ${formattedDate} à ${formattedTime}`

    return formattedDateTime
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt")

    if (!token) {
      navigate("/login")
    } else {
      const decodedToken = jwtDecode(token)
      fetchCommentById(decodedToken.dataId)
      fetchRatingByUserId(decodedToken.dataId)
      setUser(decodedToken)
    }
  }, [navigate])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        // Touche "ESC" détectée, changing vaut false
        setChanging(false)
      }
    }

    // Ajout du EventListener pour la touche "ESC"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleDeleteComment = async (commentId, commentUserId) => {
    if (window.confirm("Voulez vous-supprimer le commentaire ?")) {
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
            "Échec lors de la supression du commentaire :",
            response.statusText
          )

          alert("La supression du commentaire a échoué. Veuillez réessayer.")
        }
      } catch (error) {
        console.log(error.message)
        return console.error("Erreur lors de la supression du commentaire")
      }
    }
  }

  const handleUpdateComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/comments/${selectedComment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            content: updateComment,
          }),
        }
      )
      console.log(
        `fetch effectué sur http://localhost:3001/api/comments/${selectedComment.id}`
      )

      if (response.ok) {
        // alert("Commentaire mis à jour avec succès")
        window.location.reload()
      } else {
        console.error(
          "Échec lors de la mise à jour du commentaire:",
          response.statusText
        )
        alert("La mise à jour du commentaire a échoué. Veuillez réessayer.")
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du commentaire:",
        error.message
      )
    }
  }

  const handleDeleteReview = async (reviewId, reviewUserId) => {
    if (window.confirm("Voulez vous-supprimer l'avis ?")) {
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
            "Échec lors de la supression de l'avis :",
            response.statusText
          )

          alert("La supression de l'avis a échoué. Veuillez réessayer.")
        }
      } catch (error) {
        console.log(error.message)
        return console.error("Erreur lors de la supression de l'avis")
      }
    }
  }

  const handleUpdateReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/review/${selectedReview.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            content: updateReview,
            rating: rating,
          }),
        }
      )
      if (response.ok) {
        window.location.reload()
      } else {
        console.error(
          "Échec lors de la mise à jour de l'avis:",
          response.statusText
        )
        alert("La mise à jour de l'avis a échoué. Veuillez réessayer.")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avis:", error.message)
    }
  }

  const fetchBooksByCommentIds = async (bookIds) => {
    try {
      const booksData = {}
      for (const bookId of bookIds) {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        )
        const bookData = await response.json()

        const bookInfo = {
          title: bookData.volumeInfo.title,
          author: bookData.volumeInfo.authors
            ? bookData.volumeInfo.authors.join(", ")
            : "Auteur inconnu",
          cover: bookData.volumeInfo.imageLinks
            ? bookData.volumeInfo.imageLinks.thumbnail
            : null,
          isbn: bookData.volumeInfo.industryIdentifiers
            ? bookData.volumeInfo.industryIdentifiers[0].identifier
            : "ISBN inconnu",
        }

        booksData[bookId] = bookInfo
      }
      setBooks(booksData)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des livres :",
        error.message
      )
    }
  }

  const fetchBooksByRatingIds = async (bookIds) => {
    try {
      const booksData = {}
      for (const bookId of bookIds) {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        )
        const bookData = await response.json()

        const bookInfo = {
          title: bookData.volumeInfo.title,
          author: bookData.volumeInfo.authors
            ? bookData.volumeInfo.authors.join(", ")
            : "Auteur inconnu",
          cover: bookData.volumeInfo.imageLinks
            ? bookData.volumeInfo.imageLinks.thumbnail
            : null,
          isbn: bookData.volumeInfo.industryIdentifiers
            ? bookData.volumeInfo.industryIdentifiers[0].identifier
            : "ISBN inconnu",
        }

        booksData[bookId] = bookInfo
      }
      setBooksRatings(booksData)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des livres :",
        error.message
      )
    }
  }

  const handleToggleChanging = (selectedComment) => {
    setChanging(!changing)
    setSelectedComment(selectedComment)
    setUpdateComment(selectedComment.content)
  }

  const handleToggleChangingReview = (selectedReview) => {
    setChanging(!changing)
    setSelectedReview(selectedReview)
    setUpdateReview({
      content: selectedReview.content,
      rating: rating,
    })
  }

  const handleUserUpdate = () => {}

  return (
    <>
      <Navbar />
      <div className="container account">
        <div>
          <h1>Mon Compte</h1>
          <h2 className="accountUsername">@{user.dataUsername}</h2>
          <h2 className="accountEmail">{user.dataEmail}</h2>
          <h2>{user.dataBio}</h2>

          <br />
          <button onClick={handleUserUpdate}>Mettre à jour</button>

          {user.dataRole < 3 && (
            <button>
              <Link to="/admin/user">Administration</Link>
            </button>
          )}
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
        <div className="accountTitleContainer">
          <h3
            className={
              displayComments ? "accountTitle activated" : "accountTitle"
            }
            onClick={() => {
              setDisplayComments(true)
              setDisplayReviews(false)
            }}
            style={{ cursor: "pointer" }}
          >
            {comments.length > 0
              ? `Commentaires :     (${comments.length})`
              : "Aucun commentaire pour l'instant"}
          </h3>
          <h3
            className={
              displayReviews
                ? "accountTitle reviews activated "
                : "accountTitle reviews"
            }
            onClick={() => {
              setDisplayComments(false)
              setDisplayReviews(true)
            }}
            style={{ cursor: "pointer" }}
          >
            {review && review.length > 0
              ? `Avis :     (${review.length})`
              : "Aucun avis pour l'instant"}
          </h3>
        </div>
        <br />
        <ul>
          {displayComments &&
            comments.map((comment, index) => (
              <li className="accountCommentContainer">
                <div className="commentWrapper account">
                  <li className="commentDate">
                    {formatDateToFrench(comment.updatedAt)}
                  </li>
                  <li className="commentContent account">{comment.content}</li>
                </div>
                <div className="updateDeleteButtons">
                  <li className="updateButton account">
                    <button
                      onClick={() => {
                        handleToggleChanging(comment)
                      }}
                    >
                      Modifier
                    </button>
                  </li>
                  <li className="deleteButton account">
                    <button
                      onClick={() =>
                        handleDeleteComment(comment.id, comment.UserId)
                      }
                    >
                      <FaTrash size={25} />
                    </button>
                  </li>
                </div>
                {books[comment.bookId] && (
                  <li className="bookInfoAccount">
                    <div>
                      <p className="bookInfoTitle">
                        {books[comment.bookId].title.length > 15
                          ? `${books[comment.bookId].title.substring(0, 15)}...`
                          : books[comment.bookId].title}
                      </p>
                      <p className="bookInfoAuthor">
                        Auteur : {books[comment.bookId].author}
                      </p>
                      <p className="bookInfoISBN">
                        ISBN : {books[comment.bookId].isbn}
                      </p>
                      <p>
                        <Link
                          to={`/index?search=${books[comment.bookId].isbn}`}
                        >
                          Voir plus
                        </Link>
                      </p>
                    </div>
                    {books[comment.bookId].cover && (
                      <img
                        className="bookInfoCover"
                        src={books[comment.bookId].cover}
                        alt={books[comment.bookId].title}
                      />
                    )}
                  </li>
                )}
              </li>
            ))}
          {displayReviews &&
            review.map((review, index) => (
              <li className="accountCommentContainer">
                <div className="commentWrapper account">
                  <li className="commentDate">
                    {formatDateToFrench(review.updatedAt)}
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
                                currentRating <= review.rating
                                  ? "ffc107"
                                  : "#e4e5e9"
                              }
                            />
                          </label>
                        )
                      })}
                    </div>
                  </li>
                  <br />
                  <br />
                  <li className="commentContent account">{review.content}</li>
                </div>
                <div className="updateDeleteButtons">
                  <li className="updateButton account">
                    <button
                      onClick={() => {
                        handleToggleChangingReview(review)
                      }}
                    >
                      Modifier
                    </button>
                  </li>
                  <li className="deleteButton account">
                    <button
                      onClick={() =>
                        handleDeleteReview(review.id, review.UserId)
                      }
                    >
                      <FaTrash size={25} />
                    </button>
                  </li>
                </div>
                {booksRatings[review.bookId] && (
                  <li className="bookInfoAccount">
                    <div>
                      <p className="bookInfoTitle">
                        {booksRatings[review.bookId].title.length > 15
                          ? `${booksRatings[review.bookId].title.substring(
                              0,
                              15
                            )}...`
                          : booksRatings[review.bookId].title}
                      </p>
                      <p className="bookInfoAuthor">
                        Auteur : {booksRatings[review.bookId].author}
                      </p>
                      <p className="bookInfoISBN">
                        ISBN : {booksRatings[review.bookId].isbn}
                      </p>
                      <p>
                        <Link
                          to={`/index?search=${
                            booksRatings[review.bookId].isbn
                          }`}
                        >
                          Voir plus
                        </Link>
                      </p>
                    </div>
                    {booksRatings[review.bookId].cover && (
                      <img
                        className="bookInfoCover"
                        src={booksRatings[review.bookId].cover}
                        alt={booksRatings[review.bookId].title}
                      />
                    )}
                  </li>
                )}
              </li>
            ))}
        </ul>
        {changing && displayComments ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdateComment(selectedComment.content, selectedComment.id)
            }}
          >
            <textarea
              value={updateComment}
              onChange={(e) => setUpdateComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleUpdateComment(
                    selectedComment.content,
                    selectedComment.id
                  )
                }
              }}
              className={`updateField`}
            />
          </form>
        ) : changing && displayReviews ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdateReview(
                setUpdateReview(
                  selectedReview.content,
                  rating,
                  selectedReview.id
                )
              )
            }}
          >
            <div className="starContainer update">
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1
                if (review && review.ratings !== undefined) {
                  setRating(review.rating)
                }
                return (
                  <label>
                    <input
                      type="radio"
                      required
                      name="rating"
                      value={rating}
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
            <textarea
              value={updateReview.content}
              onChange={(e) => setUpdateReview(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleUpdateReview(
                    selectedReview.content,
                    rating,
                    selectedReview.id
                  )
                }
              }}
              className={`updateField`}
            />
            {/* <button type="submit">Mettre à jour</button> */}
          </form>
        ) : null}
      </div>
    </>
  )
}

export default AccountApp
