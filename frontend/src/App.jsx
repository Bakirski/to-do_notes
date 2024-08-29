import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header.jsx";
import LandingPage from "./components/LandingPage.jsx";
import LoginForm from "./components/LoginForm.jsx";

function App() {
  const [data, setData] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  useEffect(() => {
    fetch("http://localhost:4000/backend")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.log(err));
  }, []);

  function handleFormSubmit(data) {
    setSubmittedData(data);
    console.log("Data received from form: ", data);
  }

  return (
    <div>
      <Header />
      <p>{data ? data : "Nothing to see here..."}</p>
      <LoginForm onFormSubmit={handleFormSubmit} />
      {submittedData && (
        <div>
          <h2>Data from form</h2>
          <p>email: {submittedData.email}</p>
          <p>password: {submittedData.password}</p>
        </div>
      )}
    </div>
  );
}

export default App;
