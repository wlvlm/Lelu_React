import ACCESS_KEY from "../assets/config.js"
import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import BookCard from "./BookCard"
import { jwtDecode } from "jwt-decode"

function Home() {
  const [books, setBooks] = useState([])
  const [likes, setLikes] = useState({})
  const [ratings, setRatings] = useState({})
  const [comments, setComments] = useState({})
  const search = useLocation()
  const [value, setValue] = useState("")
  const [review, setReview] = useState({})

  const token = localStorage.getItem("jwt")
  const decodedToken = jwtDecode(token)

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const isbnParam = searchParams.get("search")

    fetchBooksData()

    if (isbnParam) {
      const isbn = isbnParam.replace("?search=", "")
      console.log("ISBN:", isbn, "Value:", value)
      setValue(isbn)
    } else {
      console.log("No ISBN found")
      setValue(value ? value : "Harry Potter")
    }
  }, [search, value])

  const fetchBooksData = async () => {
    try {
      const response =
        await fetch()`https://www.googleapis.com/books/v1/volumes?q=${value}&orderBy=relevance&maxResults=20&key=${ACCESS_KEY}`
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
          setComments((prevComments) => ({
            ...prevComments,
            [book.id]: [],
          }))
        }
      })

      const likesPromises = booksData.map(async (book) => {
        try {
          const likesResponse = await fetch(
            `http://localhost:3001/api/likes/${book.id}`
          )
          const likesData = await likesResponse.json()

          if (likesData.data) {
            const like = likesData.data
            setLikes((prevLikes) => ({
              ...prevLikes,
              [book.id]: like.likes,
            }))
            console.log(likes)
          } else {
            // Si aucun like n'est trouvé pour ce livre, initialisez-le à 0
            setLikes((prevLikes) => ({
              ...prevLikes,
              [book.id]: 0,
            }))
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des likes pour le livre ${book.id}:`,
            error
          )
          // En cas d'erreur, initialisez les likes à 0
          setLikes((prevLikes) => ({
            ...prevLikes,
            [book.id]: 0,
          }))
          console.log(likes)
        }
      })

      const ratingPromises = booksData.map((book) => {
        return fetch(`http://localhost:3001/api/review/book/${book.id}`)
          .then((ratingResponse) => ratingResponse.json())
          .then((ratingData) => {
            const reviews = ratingData.data

            if (Array.isArray(reviews) && reviews.length > 0) {
              const ratingsArray = reviews.map((review) => review.rating)

              // Calcul de la moyenne des notes
              let averageRating =
                ratingsArray.reduce((sum, rating) => sum + rating, 0) /
                ratingsArray.length

              averageRating =
                averageRating % 1 !== 0
                  ? averageRating.toFixed(1)
                  : averageRating.toFixed(0)

              setRatings((prevRatings) => ({
                ...prevRatings,
                [book.id]: averageRating,
              }))
            } else {
              setRatings((prevRatings) => ({
                ...prevRatings,
                [book.id]: 0,
              }))
            }
            return null
          })
          .catch((error) => {
            console.error(
              `Erreur lors de la récupération des notes pour le livre ${book.id}:`,
              error
            )
            setRatings((prevRatings) => ({
              ...prevRatings,
              [book.id]: 0,
            }))
            return null
          })
      })

      await Promise.all([
        ...commentsPromises,
        ...likesPromises,
        ...ratingPromises,
      ])

      const userRatingPromises = booksData.map(async (book) => {
        return await fetch(
          `http://localhost:3001/api/review/user/${decodedToken.dataId}`
        )
          .then((ratingResponse) => ratingResponse.json())
          .then((ratingData) => {
            if (Array.isArray(ratingData.data) && ratingData.data.length > 0) {
              const reviewUser = ratingData.data.find(
                (reviewFetched) => reviewFetched.bookId === book.id
              )

              setReview((prevReviews) => ({
                ...prevReviews,
                [book.id]: reviewUser ? reviewUser : [],
              }))
            } else {
              console.error(`Aucun avis trouvé pour le livre "${book.title}"`)
              setReview((prevReviews) => ({
                ...prevReviews,
                [book.id]: [],
              }))
            }
          })
          .catch((error) => {
            console.error(error.message)
          })
      })

      await Promise.all(userRatingPromises)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données:",
        error.message
      )
    }
  }

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
              likes={likes}
              ratingAverage={ratings}
              reviews={review[book.id]}
              comments={comments[book.id] || []}
            />
          </div>
        ))}
      </div>
    </main>
  )
}

export default Home
