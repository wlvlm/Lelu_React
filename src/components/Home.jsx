import ACCESS_KEY from "../assets/config.js"
import React, { useState, useEffect } from "react"
import BookCard from "./BookCard"

function Home() {
  const [books, setBooks] = useState([])
  const [comments, setComments] = useState({})
  const [value, setValue] = useState("Harry%20Potter")

  const fetchBooksAndComments = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${value}&orderBy=relevance&maxResults=20&key=${ACCESS_KEY}`
      )
      const data = await response.json()

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

      setBooks(booksData)

      const commentsPromises = booksData.map(async (book) => {
        const commentResponse = await fetch(
          `http://localhost:3001/api/comments/book/${book.id}`
        )
        const commentData = await commentResponse.json()

        const commentsData = commentData.data

        if (Array.isArray(commentsData) && commentsData.length > 0) {
          const bookComments = commentsData.map((comment) => comment)
          setComments((prevComments) => ({
            ...prevComments,
            [book.id]: bookComments,
          }))
        } else {
          console.error(
            `Aucun commentaire trouvé pour le livre "${book.title}"`
          )
        }
      })

      await Promise.all(commentsPromises)
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
    }
  }

  useEffect(() => {
    fetchBooksAndComments()
  }, [value])

  const handleInputChange = (event) => {
    event.preventDefault()
    setValue(event.target.value)
  }

  return (
    <main>
      <form className="form" method="GET">
        <input
          placeholder="Chercher un livre par titre, auteur, ISBN..."
          type="search"
          name="search"
          className="search"
          onChange={handleInputChange}
        />
      </form>
      <div className="container">
        {books.map((book, index) => (
          <div key={index} className="cardContainer">
            <BookCard
              key={index}
              book={book}
              comments={comments[book.id] || []}
            />
          </div>
        ))}
      </div>
    </main>
  )
}

export default Home
