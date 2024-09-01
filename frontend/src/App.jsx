import React, { useState } from "react";
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ToDo from "./components/ToDo.jsx";
import CreateNote from "./components/CreateNote.jsx";
import Note from "./components/Note.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [signedUp, setSignedUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState(null);
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
    setIsAuthenticated(true);

    console.log("Data received from form: ", data);
  }

  /*  <div className="app-options">
      <button onClick={() => setView("todo")}>To-Do List</button>
      <button onClick={() => setView("notes")}>Notes App</button>
        </div>
  */

  /* {submittedData && <Header name={submittedData.name} />}
      {!isAuthenticated ? (
        signedUp === false ? (
          <RegisterForm
            onFormSubmit={handleFormSubmit}
            onClicked={toggleForm}
          />
        ) : (
          <LoginForm onFormSubmit={handleFormSubmit} onClicked={toggleForm} />
        )
      ) : (
        //Ovdje buttons
      )}*/
  return (
    <div>
      {submittedData && <Header name={submittedData.name} />}
      {!isAuthenticated ? (
        signedUp === false ? (
          <RegisterForm
            onFormSubmit={handleFormSubmit}
            onClicked={toggleForm}
          />
        ) : (
          <LoginForm onFormSubmit={handleFormSubmit} onClicked={toggleForm} />
        )
      ) : (
        <div className="app-options">
          <button onClick={() => setView("todo")}>To-Do List</button>
          <button onClick={() => setView("notes")}>Notes App</button>
        </div>
      )}
      {view === "todo" && <ToDo />}
      {view === "notes" && (
        <div>
          <CreateNote onAdd={addNote} />
          <div className="notes-grid-container">
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
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
