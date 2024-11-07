import React, { useState } from "react";
import axios from "axios";
import "../AuthForm.css";

function RegisterForm(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const signed = false;

  function handleChange(event) {
    const { value, name } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/register",
        formData
      );
      props.onFormSubmit(response.data);
    } catch (err) {
      console.log(err);
    }
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-content">
        <h1 className="auth-title">Sign Up</h1>
        <label htmlFor="name" className="auth-label">
          Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          id="name"
          name="name"
          onChange={handleChange}
          value={formData.name}
          className="auth-input"
        />
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
        <label htmlFor="confirmPassword" className="auth-label">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="********"
          onChange={handleChange}
          value={formData.confirmPassword}
          className="auth-input"
        />
        <div className="auth-buttons">
          <button type="submit" className="auth-button">
            Sign Up
          </button>
          <button
            type="button"
            className="auth-toggle-button"
            onClick={props.onClicked}
          >
            Already have an account? Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
