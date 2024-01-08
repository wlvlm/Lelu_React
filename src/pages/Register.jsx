import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

// function showPassword() {
//   const checkbox = document.querySelector("#showPasswordCheckbox")
//   const eyeOpen = document.querySelector("#checkbox-true")
//   const eyeClose = document.querySelector("#checkbox-false")
//   const password = document.querySelector("#loginPassword")

//   if (checkbox.checked === true) {
//     password.type = "text"
//   } else {
//     password.type = "password"
//   }
// }

const Register = ({ loginThroughRegister }) => {
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()

    const email = event.target.email.value
    const username = event.target.username.value
    const password = event.target.password.value

    const registerData = {
      email,
      username,
      password,
    }

    const registerDataJson = JSON.stringify(registerData)

    const registerResponse = await fetch(
      "http://localhost:3001/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: registerDataJson,
      }
    )

    const registerResponseData = await registerResponse.json()
    const token = registerResponseData.data

    if (registerResponseData) {
      setMessage(registerResponseData.message)
      setMessageStatus(registerResponseData.isGood)
      if (token) {
        // return console.log(token)
        localStorage.setItem("jwt", token)
        setMessage("Vous êtes bien connecté")
        setMessageStatus(registerResponseData.isGood)
        setTimeout(() => {
          navigate("/index")
          loginThroughRegister()
        }, 1000)
      }
    } else {
      setMessage("Erreur lors de l'inscription")
      setMessageStatus(registerResponseData.isGood)
    }
  }

  return (
    <>
      {message && <p className={messageStatus ? "good" : "bad"}>{message}</p>}
      <main class="login">
        <div class="modal">
          <h1 class="logo">LELU</h1>
          <form class="login" onSubmit={handleRegister}>
            <input placeholder="Email*" required type="email" name="email" />
            <br />
            <br />
            <input placeholder="Pseudo*" required type="text" name="username" />
            <br />
            <br />

            <div class="password">
              <input
                placeholder="Mot de passe*"
                required
                type="password"
                id="loginPassword"
                name="password"
              />
              <label>
                <input
                  type="checkbox"
                  id="showPasswordCheckbox"
                  //   onclick={showPassword()}
                />
                <span id="checkbox-true">
                  <img class="eyeIcon" src="assets/img/eye-open.svg" alt="" />
                </span>
                <span id="checkbox-false">
                  <img class="eyeIcon" src="assets/img/eye-close.svg" alt="" />
                </span>
              </label>
            </div>
            <br />
            <br />
            <input type="submit" value="S'inscrire" />
            <br />
            <br />

            <Link to="/Login">Se connecter</Link>
            <br />
          </form>
        </div>
      </main>
    </>
  )
}

export default Register
