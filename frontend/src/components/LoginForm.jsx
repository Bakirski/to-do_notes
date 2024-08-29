import React, { useState } from "react";
import axios from "axios";
function LoginForm(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //handleChange upisuje vrijednosti koje se unose u formu pomocu spread operatora i atributa event.target - a.
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  /*
  handleSubmit salje post request za backend zajedno sa unesenim podacima iz forme.
  onFormSubmit je prop koji je deklarisan u App.jsx pri pozivu LoginForm elementa. Prosljeduje mu se funkcija handleFormSubmit.
  funkcija za submit mora biti asinhrona zbog axiosa.
  */
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/main-page",
        formData
      );
      {
        props.onFormSubmit(response.data);
      }
    } catch (err) {
      console.log(err);
    }
    setFormData({ email: "", password: "" });
  }

  /*
  U reactu se koristi u formi onSubmit za submitanje podataka.
  na dnu ide submit button umjesto input elementa.
  */
  return (
    <div>
      <form onSubmit={handleSubmit} className="sign-in-container">
        <h1>Sign in</h1>
        <label for="email">Email</label>
        <input
          type="text"
          placeholder="johndoe@gmail.com"
          id="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <label for="password">Password</label>
        <input
          type="password"
          placeholder="********"
          id="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <button type="submit">Log In</button>
        <p className="signup-text">
          Don't Have an Account? <a href="/">Sign Up</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
