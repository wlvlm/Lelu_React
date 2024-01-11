import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Favorite from "../assets/img/Favorite.png"
import { FaStar } from "react-icons/fa"

function DiscoverApp() {
  const [bestRatedBook, setBestRatedBook] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsResponse = await fetch("http://localhost:3001/api/review")
        const reviewsData = await reviewsResponse.json()

        const booksReviews = reviewsData.reduce((acc, review) => {
          const bookId = review.bookId

          if (!acc[bookId]) {
            acc[bookId] = [review]
          } else {
            acc[bookId].push(review)
          }

          return acc
        }, {})

        // Trouver le livre avec le plus grand nombre de critiques
        const mostReviewedBookId = Object.keys(booksReviews).reduce((a, b) =>
          booksReviews[a].length > booksReviews[b].length ? a : b
        )

        const highestRatedReview = booksReviews[mostReviewedBookId].reduce(
          (maxReview, review) => (review.rating === 5 ? review : maxReview),
          null
        )

        const bookDetailsResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${mostReviewedBookId}`
        )
        const bookDetailsData = await bookDetailsResponse.json()

        // Set le livre le plus critiqué et la critique avec la note la plus élevée dans le state
        setBestRatedBook({
          title: bookDetailsData.volumeInfo.title,
          author: bookDetailsData.volumeInfo.authors
            ? bookDetailsData.volumeInfo.authors.join(", ")
            : "Auteur inconnu",
          synopsis: bookDetailsData.volumeInfo.description,
          coverUrl: bookDetailsData.volumeInfo.imageLinks
            ? bookDetailsData.volumeInfo.imageLinks.thumbnail
            : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
          highestRatedReview: highestRatedReview || {
            rating: 0,
            content: "Aucune critique avec la note maximale.",
          },
        })
        console.log(highestRatedReview)
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Navbar />
      {bestRatedBook && (
        <main>
          <div class="discoverContainer">
            <div class="wrapper">
              <div class="insideWrapper">
                <div class="LOMContainer">
                  <h1 class="LOM">LELU</h1>
                  <p class="LOMp">du mois</p>
                </div>
                <div class="bookInfo">
                  <h2 class="title discover" data-title={bestRatedBook.title}>
                    {bestRatedBook.title}
                  </h2>
                  <h4 class="bookAuthor">Auteur : {bestRatedBook.author}</h4>
                </div>
                <div class="synopsis">
                  <p>
                    <span>Synopsis : </span>
                    {bestRatedBook.synopsis.replace(/<\/?p>/g, "")}
                  </p>
                </div>
                <div class="opinion">
                  <h2 class="title discover" data-title="Votre avis :">
                    Votre avis :
                  </h2>
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
                              currentRating <=
                              bestRatedBook.highestRatedReview.rating
                                ? "ffc107"
                                : "#e4e5e9"
                            }
                          />
                        </label>
                      )
                    })}
                  </div>
                  <p>{bestRatedBook.highestRatedReview.content}</p>
                </div>
              </div>
            </div>
            <div class="imgDiscoverContainer">
              <img src={Favorite} class="favorite" alt="IMG" />
              <img
                class="discoverCover"
                src={bestRatedBook.coverUrl}
                alt={`Couverture de ${bestRatedBook.title}`}
              />
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default DiscoverApp
