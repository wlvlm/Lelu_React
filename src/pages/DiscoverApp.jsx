import ACCESS_KEY from "../assets/config.js"
import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Favorite from "../assets/img/Favorite.png"

function DiscoverApp() {
  const [bestRatedBook, setBestRatedBook] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsResponse = await fetch("http://localhost:3001/api/review")
        const reviewsData = await reviewsResponse.json()

        console.log(reviewsData)
        // Créer un tableau d'objets avec le bookId et le nombre de critiques pour chaque livre
        const booksReviewCounts = reviewsData.reduce((acc, review) => {
          const bookId = review.bookId

          if (!acc[bookId]) {
            acc[bookId] = 1
          } else {
            acc[bookId]++
          }

          return acc
        }, {})

        // Trouver le livre avec le plus grand nombre de critiques
        const mostReviewedBookId = Object.keys(booksReviewCounts).reduce(
          (a, b) => (booksReviewCounts[a] > booksReviewCounts[b] ? a : b)
        )

        // Récupérer les détails du livre le plus critiqué
        const bookDetailsResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${mostReviewedBookId}&key=${ACCESS_KEY}`
        )
        const bookDetailsData = await bookDetailsResponse.json()

        console.log(bookDetailsData)

        // Set le livre le plus critiqué dans le state
        setBestRatedBook({
          title: bookDetailsData.volumeInfo.title,
          author: bookDetailsData.volumeInfo.authors
            ? bookDetailsData.volumeInfo.authors.join(", ")
            : "Auteur inconnu",
          coverUrl: bookDetailsData.volumeInfo.imageLinks
            ? bookDetailsData.volumeInfo.imageLinks.thumbnail
            : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
        })
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }

    fetchData()
  }, [])

  console.log(bestRatedBook)

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
                  <h2 class="title discover" data-title="Titre du livre">
                    {bestRatedBook.title}
                  </h2>
                  <h4 class="bookAuthor">Auteur : {bestRatedBook.title}</h4>
                </div>
                <div class="synopsis">
                  <p>
                    <span>Synopsis :</span> Lorem ipsum dolor sit amet,
                    consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et dolore magna aliquyam erat, sed diam
                    voluptua. At vero eos et accusam et justo duo dolores et ea
                    rebum. Stet clita kasd gubergren, no sea takimata sanctus
                    est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                    consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et dolore magna aliquyam erat, sed diam
                    voluptua. At vero eos et accusam et justo duo dolores. Lorem
                    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat.
                  </p>
                </div>
                <div class="opinion">
                  <h2 class="title discover" data-title="Votre avis :">
                    Votre avis :
                  </h2>
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
