import React, { useState } from "react";
import axios from "axios";
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
    <div>
      <form onSubmit={handleSubmit} className="sign-up-container">
        <h1>Sign Up</h1>
        <label for="name">Name</label>
        <input
          type="text"
          placeholder="John Doe"
          id="name"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
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
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="********"
          onChange={handleChange}
          value={formData.confirmPassword}
        />

        <button type="submit">Sign Up</button>
        <button
          className="already-have-account-btn"
          onClick={() => {
            props.onClicked(signed);
          }}
        >
          Already have an Account? Sign In
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
