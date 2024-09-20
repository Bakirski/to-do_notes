import React, { useState } from "react";
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ToDo from "./components/ToDo.jsx";
import CreateNote from "./components/CreateNote.jsx";
import Note from "./components/Note.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import EditNote from "./components/EditNote.jsx";

function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [signedUp, setSignedUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: "", content: "" });

  function toggleForm(signed) {
    setSignedUp(signed);
  }

  function addNote(noteItem) {
    setEditMode(false);
    setNotes([...notes, noteItem]);
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((item, index) => {
        return index !== id;
      });
    });
  }

  function handleEdit(id) {
    editNote(id);
    deleteNote(id);
  }

  function editNote(id) {
    const noteId = parseInt(id);
    const editingNote = notes.find((element) => id === noteId);
    console.log(editingNote);
    setEditMode(true);
    setEditedNote({ title: editingNote.title, content: editingNote.content });
  }

  function handleFormSubmit(data) {
    setSubmittedData(data);
    if (data) {
      setIsAuthenticated(true);
    }
  }

  return (
    <div>
      {submittedData ? (
        submittedData ? (
          <Header name={submittedData} />
        ) : (
          <h3>{submittedData}</h3>
        )
      ) : null}

      {isAuthenticated === false ? (
        signedUp === false ? (
          <LoginForm onFormSubmit={handleFormSubmit} onClicked={toggleForm} />
        ) : (
          <RegisterForm
            onFormSubmit={handleFormSubmit}
            onClicked={toggleForm}
          />
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
          {editMode === false ? (
            <CreateNote onAdd={addNote} />
          ) : (
            <EditNote
              title={editedNote.title}
              content={editedNote.content}
              onChanged={addNote}
            />
          )}
          <div className="notes-grid-container">
            {notes.map((item, index) => {
              return (
                <Note
                  key={index}
                  id={index}
                  title={item.title}
                  content={item.content}
                  onClicked={deleteNote}
                  onEdit={handleEdit}
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
