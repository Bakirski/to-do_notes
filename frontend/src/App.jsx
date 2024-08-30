import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header.jsx";
import LandingPage from "./components/LandingPage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ToDo from "./components/ToDo.jsx";
import CreateNote from "./components/CreateNote.jsx";
import Note from "./components/Note.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [signedUp, setSignedUp] = useState(false);

  function toggleForm(signed) {
    setSignedUp(signed);
  }

  function addNote(noteItem) {
    setNotes([...notes, noteItem]);
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((item, index) => {
        return index !== id;
      });
    });
  }

  function handleFormSubmit(data) {
    setSubmittedData(data);
    console.log("Data received from form: ", data);
  }

  /*      <LoginForm onFormSubmit={handleFormSubmit} />
      {submittedData && (
        <div>
          <h2>Data from form</h2>
          <p>email: {submittedData.email}</p>
          <p>password: {submittedData.password}</p>
        </div>
      )}
      <ToDo /> */
  /*      <CreateNote onAdd={addNote} />
      {notes.map((item, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={item.title}
            content={item.content}
            onClicked={deleteNote}
          />
        );
      })}
             {submittedData && (
        <div>
          <h2>Data from form</h2>
          <p>name: {submittedData.name}</p>
          <p>email: {submittedData.email}</p>
          <p>password: {submittedData.password}</p>
          <p>Confirmed Pass: {submittedData.confirmPassword}</p>
        </div>
      )} 
      */
  return (
    <div>
      <Header />
      {signedUp === false ? (
        <RegisterForm onFormSubmit={handleFormSubmit} onClicked={toggleForm} />
      ) : (
        <LoginForm onFormSubmit={handleFormSubmit} onClicked={toggleForm} />
      )}
    </div>
  );
}

export default App;
