// App.js
import React, { useState } from "react";
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ToDo from "./components/ToDo.jsx";
import CreateNote from "./components/CreateNote.jsx";
import Note from "./components/Note.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import EditNote from "./components/EditNote.jsx";
import NoteExplorer from "./components/NoteExplorer.jsx";
import axios from "axios";
import Collapse from "@mui/material/Collapse";

function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [signedUp, setSignedUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: "", content: "" });
  const [showRegister, setShowRegister] = useState(true);
  const [showCurrentForm, setShowCurrentForm] = useState(true);

  function handleToggleForm() {
    setShowCurrentForm(false); // Start collapsing out the current form

    // After 500ms (duration of Collapse animation), toggle the form and collapse it in
    setTimeout(() => {
      setSignedUp((prev) => !prev);
      setShowCurrentForm(true); // Collapse in the new form
    }, 300);
  }

  // Toggles between register and login forms based on signed variable
  function toggleForm(signed) {
    setSignedUp(!signed);
  }

  // Disables edit mode if active and adds note to temporary storage
  function addNote(noteItem) {
    setEditMode(false);
    setNotes([...notes, noteItem]);
  }

  // Deletes a selected note by finding a matching index with the provided id
  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((item, index) => index !== id);
    });
  }

  // Triggers edit by removing note from temporary array and calling editNote function
  function handleEdit(id) {
    editNote(id);
    deleteNote(id);
  }

  // Finds note matching provided id and toggles edit mode
  function editNote(id) {
    const noteId = parseInt(id);
    const editingNote = notes.find((element, index) => index === noteId);
    console.log(editingNote);
    setEditMode(true);
    setEditedNote({ title: editingNote.title, content: editingNote.content });
  }

  // Saves note to PostgreSQL database
  async function saveNote(id, title, content) {
    console.log(title, content);
    try {
      const response = await axios.post("http://localhost:4000/notes", {
        title,
        content,
      });
      console.log(response);
      deleteNote(id);
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  }

  /*
    If login or registration is successful, returns user data if available.
    If returned data exists, authenticated is set to true and user gains
    access to the rest of the app.
  */
  function handleFormSubmit(data) {
    setSubmittedData(data);
    if (data) {
      setIsAuthenticated(true);
    }
  }

  /*
    submittedData holds the return data when a user attempts login or
    registration, returning either the user's name or an error message
    based on the outcome of login/register. If isAuthenticated is true,
    the rest of the program is rendered (placeholder buttons).
    
    Options include To-Do list and notes app, rendering the relevant
    components based on user selection.
  */
  return (
    <div>
      {submittedData ? <Header name={submittedData} /> : null}
      {view !== null && (
        <div
          className="back-button-container"
          onClick={() => {
            setView(null);
          }}
        >
          <button>Back</button>
        </div>
      )}
      {!isAuthenticated ? (
        <div>
          <Collapse in={showCurrentForm} timeout={500}>
            <div>
              {signedUp ? (
                <RegisterForm
                  onFormSubmit={handleFormSubmit}
                  onClicked={handleToggleForm}
                />
              ) : (
                <LoginForm
                  onFormSubmit={handleFormSubmit}
                  onClicked={handleToggleForm}
                />
              )}
            </div>
          </Collapse>
        </div>
      ) : (
        view === null && (
          <div className="app-options">
            <button
              onClick={() => setView("todo")}
              className="to-do-app-div"
            ></button>
            <button
              onClick={() => setView("notes")}
              className="notes-app-div"
            ></button>
          </div>
        )
      )}

      {view === "todo" && <ToDo />}
      {view === "notes" && (
        <div>
          <NoteExplorer name={submittedData} addToNotes={addNote} />
          {editMode ? (
            <EditNote
              title={editedNote.title}
              content={editedNote.content}
              onChanged={addNote}
            />
          ) : (
            <CreateNote onAdd={addNote} />
          )}
          <div className="notes-grid-container">
            {notes.map((item, index) => (
              <Note
                key={index}
                id={index}
                title={item.title}
                content={item.content}
                onClicked={deleteNote}
                onEdit={handleEdit}
                onSave={saveNote}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
