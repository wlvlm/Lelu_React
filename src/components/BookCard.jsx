import React, { useState } from "react"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const BookCard = ({ book, comments }) => {
  const [value, setValue] = useState("")

  const token = localStorage.getItem("jwt")
  const decodedToken = jwtDecode(token)

  const handleDeleteComment = async (commentId, commentUserId) => {
    // event.preventDefault()
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
          // alert("Commentaire suprrimé avec succès")
          window.location.reload()
        } else {
          console.error(
            "Échec lors de la supression du commentaire :",
            response.statusText
          )

          alert("La supression du commentaire a échoué. Veuillez réessayer.")
        }
      } catch (error) {
        console.error("Erreur lors de la supression du commentaire")
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
        // alert("Commentaire créé avec succès")
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
          <h2 className="title">4.7</h2>
          <div className="starContainer">★★★★★</div>
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
        </div>
      </div>
    </div>
  )
}

export default BookCard
