import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import LandingPage from "./components/LandingPage.jsx";
function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("http://localhost:4000/backend")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Header />
      <LandingPage />
      <p>{data ? data : "Nothing to see here..."}</p>
    </div>
  );
}

export default App;
