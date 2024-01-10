// import Home from "./Home"
import Navbar from "../components/Navbar"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function ProfilePage({ onLogout }) {
  const navigate = useNavigate()
  const [user, setUser] = useState("")
  const [profile, setProfile] = useState("")
  const [comments, setComments] = useState([])
  const [books, setBooks] = useState({})
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem("jwt")

    if (!token) {
      navigate("/login")
    } else {
      const decodedToken = jwtDecode(token)
      setUser(decodedToken)
    }
  }, [navigate])

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
    // On récupère les données de la page consultée
    const fetchProfile = async (id) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`)
        const data = await response.json()

        if (data.data) {
          const userData = { ...data.data }
          // On les stocke dans le state Profile pour les afficher
          setProfile(userData)
        } else {
          navigate("/index")
          alert(`Aucun profil n'existe pour l'id ${id}, retour à l'accueil...`)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
      }
    }

    // On déclenche la fonction
    fetchProfile(id)
    fetchCommentById(id)
  }, [id])

  useEffect(() => {
    // On vérifie si l'utilisateur consulte sa propre page et si oui on le renvoie vers la page "Mon Compte"
    if (user.dataId === parseInt(id)) {
      navigate("/account")
    }
  }, [user, id, navigate])

  const fetchBooksByCommentIds = async (bookIds) => {
    try {
      const booksData = {}
      for (const bookId of bookIds) {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        )
        const bookData = await response.json()

        const bookInfo = {
          id: bookData.id,
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

  return (
    <>
      <Navbar />
      <div className="container account profileContainer">
        <div>
          {/* <img
            className="profilePicture"
            src={profile.Pdp}
            alt={'Photo de "' + profile.username + '"'}
          /> */}
          <Link className="accountUsernameLink" to={`/profile/${profile.id}`}>
            <h2 className="accountUsername">@{profile.username}</h2>
          </Link>
          <h2>{profile.bio}</h2>
        </div>
        <h3 className="accountTitle">
          {comments.length > 0
            ? `Commentaires :       (${comments.length})`
            : "Aucun commentaire pour l'instant"}
        </h3>
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
                      {/* <Link to={`/index?search=${books[comment.bookId].id}`}> */}
                      <Link to={`/index?search=${books[comment.bookId].isbn}`}>
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
        </ul>
      </div>
    </>
  )
}

export default ProfilePage
