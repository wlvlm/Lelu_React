import logo from "../assets/img/LELU_logo.svg"
import index from "../assets/img/index.svg"
import catalog from "../assets/img/catalog.svg"
import community from "../assets/img/community.svg"
import account from "../assets/img/account.png"
import { Link } from "react-router-dom"

function Navbar() {
  // Assure la mise à jour des données et le retour à l'index lors du clic sur l'index
  const handleClickIndex = () => {
    window.location.replace("/index")
  }

  return (
    <>
      <nav>
        <img src={logo} alt="Logo de LELU" className="logo" />
        <ul className="nav">
          <li className="mobile index">
            <Link to="/index" onClick={handleClickIndex}>
              <img src={index} alt="nav_icon" />
            </Link>
          </li>

          <li className="mobile catalog">
            <Link to="/discover">
              <img src={catalog} alt="nav_icon" />
            </Link>
          </li>

          <li className="mobile community">
            <Link to="/community">
              <img src={community} alt="nav_icon" />
            </Link>
          </li>

          <li className="mobile">
            <Link to="/account">
              <img src={account} className="account" alt="nav_icon" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
