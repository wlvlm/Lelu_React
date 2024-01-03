import React from "react"

const BookCard = ({ book }) => {
  return (
    <div className="card">
      <div className="leftSide">
        <h2 className="title">{book.title}</h2>
        <h4 className="isbn">ISBN: {book.isbn}</h4>
        <h4 className="bookAuthor">Auteur: {book.author}</h4>
        <div class="rating">
          <p class="average">Moyenne totale :</p>
          <h2 class="title">4.7</h2>
          <div class="starContainer">★★★★★</div>
        </div>
        <img src={book.coverUrl} alt={book.title} />
        <div className="imgContainer"></div>
      </div>
      <div className="rightSide"></div>
      {/* Ajoutez d'autres informations nécessaires */}
    </div>
  )
}

export default BookCard
