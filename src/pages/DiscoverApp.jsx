// import Home from "./Home"
import Navbar from "../components/Navbar"
import Favorite from "../assets/img/Favorite.png"

function DiscoverApp() {
  return (
    <>
      <Navbar />
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
                  Titre du livre
                </h2>
                <h4 class="bookAuthor">Auteur : John Doe</h4>
              </div>
              <div class="synopsis">
                <p>
                  <span>Synopsis :</span> Lorem ipsum dolor sit amet, consetetur
                  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                  labore et dolore magna aliquyam erat, sed diam voluptua. At
                  vero eos et accusam et justo duo dolores et ea rebum. Stet
                  clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
                  dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                  labore et dolore magna aliquyam erat, sed diam voluptua. At
                  vero eos et accusam et justo duo dolores. Lorem ipsum dolor
                  sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                  tempor invidunt ut labore et dolore magna aliquyam erat.
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
              src="https://i.pinimg.com/236x/37/a9/98/37a99839a447357ee6d3d4b9c991d864.jpg"
              alt="IMG"
            />
          </div>
        </div>
        <div class="discoverBooks">
          <h2 class="title discover" data-title="Découvrir des livres">
            Découvrir des livres
          </h2>
        </div>
      </main>
    </>
  )
}

export default DiscoverApp
