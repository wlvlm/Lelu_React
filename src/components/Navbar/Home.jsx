import ACCESS_KEY from "../../assets/config.js"
import React, { useState, useEffect } from "react"
import BookCard from "./BookCard"

const fetchBooks = (value, setBooks) => {
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${value}&orderBy=relevance&maxResults=20&key=${ACCESS_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const booksData = data.items.map((item) => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors
          ? item.volumeInfo.authors.join(", ")
          : "Auteur inconnu",
        isbn: item.volumeInfo.industryIdentifiers
          ? item.volumeInfo.industryIdentifiers[0].identifier
          : "ISBN inconnu",
        coverUrl: item.volumeInfo.imageLinks
          ? item.volumeInfo.imageLinks.thumbnail
          : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
        id: item.id,
      }))
      getBookData(booksData.id)
      setBooks(booksData)
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des données:", error)
    )
}

// Récupération des données de notre API
const getBookData = (value) => {
  fetch(`http://localhost:3001/api/comments/book/${value}`)
  .then((response) => response.json())
  .then((data) => {})
  .catch((error) => {
    console.error("Erreur lors de la récupération des commentaires:", error)
  }
}

function Home() {
  const [books, setBooks] = useState([])
  const [value, setValue] = useState("Harry Potter")

  useEffect(() => {
    fetchBooks(value, setBooks)
  }, [value])

  const handleInputChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <main>
      <form class="form" method="GET">
        <input
          placeholder="Chercher un livre"
          type="search"
          name="search"
          class="search"
          onChange={handleInputChange} //Mise à jour de la recherche
        />
      </form>
      <div class="container">
        {/* <div class="card">
          <div class="leftSide">
            <h2 class="title" data-title="Titre du livre">
              Titre du livre
            </h2>
            <h4 class="isbn">0123456789101</h4>
            <h4 class="bookAuthor">Auteur : John Doe</h4>
            <div class="rating">
              <p class="average">Moyenne totale :</p>
              <h2 class="title">4.7</h2>
              <div class="starContainer">★★★★★</div>
            </div>
            <img
              src="https://i.pinimg.com/236x/37/a9/98/37a99839a447357ee6d3d4b9c991d864.jpg"
              alt="cover"
            />
            <div class="imgContainer"></div>
          </div>
          <div class="rightSide"></div>
        </div> */}
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </main>
  )
}

export default Home
