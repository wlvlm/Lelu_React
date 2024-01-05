import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { jwtDecode } from "jwt-decode"

function AccountApp({ onLogout }) {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [comments, setComments] = useState([])
  const [changing, setChanging] = useState(false)
  const [selectedComment, setSelectedComment] = useState(null)
  const [updateComment, setUpdateComment] = useState("")
  const [books, setBooks] = useState({})

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

  const handleToggleChanging = (selectedComment) => {
    setChanging(!changing)
    setSelectedComment(selectedComment)
    setUpdateComment(selectedComment.content)
  }

  return (
    <>
      <Navbar />
      <div className="container account">
        <div>
          <h1>Mon Compte</h1>
          <h2 className="accountUsername">@{user.dataUsername}</h2>
          <h2 className="accountEmail">{user.dataEmail}</h2>
          <br />
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
        <h3 className="accountTitle">Commentaires ({comments.length}) :</h3>
        <br />
        <ul>
          {comments.map((comment, index) => (
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
                    Supprimer
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
              {changing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleUpdateComment(
                      selectedComment.content,
                      selectedComment.id
                    )
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
                  <button type="submit">Mettre à jour</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default AccountApp
