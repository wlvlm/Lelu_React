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

const Login = ({ onLogin }) => {
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    const email = event.target.email.value
    const password = event.target.password.value

    const loginData = {
      email,
      password,
    }

    const loginDataJson = JSON.stringify(loginData)

    const loginResponse = await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: loginDataJson,
    })

    const loginResponseData = await loginResponse.json()
    const token = loginResponseData.data

    if (token) {
      localStorage.setItem("jwt", token)
      setMessage("Vous êtes bien connecté")
      setMessageStatus(loginResponseData.isGood)
      setTimeout(() => {
        onLogin()
        navigate("/index")
      }, 1000)
    } else {
      setMessage(loginResponseData.message)
      setMessageStatus(loginResponseData.isGood)
    }
  }

  return (
    <>
      {message && <p className={messageStatus ? "good" : "bad"}>{message}</p>}
      <main class="login">
        <div class="modal">
          <h1 class="logo">LELU</h1>
          <form onSubmit={handleLogin} class="login">
            <input placeholder="Email*" required type="email" name="email" />
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
            <input type="submit" value="Se connecter" />
            <br />
            <br />

            <Link to="/register">S'inscrire</Link>
            {/* <a href="register.php">S'inscrire</a> */}
            <br />
            {/* <a href="forgottenPassword.php">Mot de passe oublié ?</a> */}
          </form>
        </div>
      </main>
    </>
  )
}

export default Login
