import React, { useState } from "react";
import axios from "axios";
function LoginForm(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const signed = true;
  //handleChange upisuje vrijednosti koje se unose u formu pomocu spread operatora i atributa event.target - a.
  function handleChange(event) {
    const { value, name } = event.target;
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
        "http://localhost:4000/login",
        formData,
        { withCredentials: true }
      );
      props.onFormSubmit(response.data);
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
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-content">
        <h1 className="auth-title">Sign In</h1>
        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          type="text"
          placeholder="johndoe@gmail.com"
          id="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          className="auth-input"
        />
        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <input
          type="password"
          placeholder="********"
          id="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          className="auth-input"
        />
        <div className="auth-buttons">
          <button type="submit" className="auth-button">
            Sign In
          </button>
          <button
            type="button"
            className="auth-toggle-button"
            onClick={props.onClicked}
          >
            Not Registered? Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
