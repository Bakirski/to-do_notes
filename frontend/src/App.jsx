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

function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [signedUp, setSignedUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: "", content: "" });

  //na osnovu vrijednosti signed varijable toggle-uje izmedju register i login forme
  function toggleForm(signed) {
    setSignedUp(signed);
  }

  //iskljucuje edit mode ukoliko je trenutno aktivan i popunjava notes u privremenu memoriju
  function addNote(noteItem) {
    setEditMode(false);
    setNotes([...notes, noteItem]);
  }

  //brise odabrani note tako sto trazi index koji se poklapa sa proslijeđenim
  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((item, index) => {
        return index !== id;
      });
    });
  }

  //klikom na edit, brise note iz privremenog niza notes-a i poziva editNote funkciju
  function handleEdit(id) {
    editNote(id);
    deleteNote(id);
  }

  //trazi note koji odgovara proslijeđenom id-u i toggle-uje edit mode
  function editNote(id) {
    const noteId = parseInt(id);
    const editingNote = notes.find((element) => id === noteId);
    console.log(editingNote);
    setEditMode(true);
    setEditedNote({ title: editingNote.title, content: editingNote.content });
  }

  //sprema note u bazu podataka u postgresu
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

  /*ukoliko je login odnosno register uspjesan, vracaju se podaci o korisniku
  ukoliko postoje vraceni podaci authenticated postaje true i korisnik
  dobija pristup ostatku stranice
  */
  function handleFormSubmit(data) {
    setSubmittedData(data);
    if (data) {
      setIsAuthenticated(true);
    }
  }

  /*
    submittedData se odnosi na povratnu informaciju
    koja se vraca kada korisnik pokusa obaviti login
    ili register. Vraca ime korisnika ili poruku greske
    zavisno od toga da li je login/register uspjesan.

    Ako je isAuthenticated true, renderuje se ostatak
    programa (placeholder buttons).
    ToDo list i notes app opcije
    Zavisno od odabira renderuju se potrebne komponente.
  */
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
          <NoteExplorer name={submittedData} addToNotes={addNote} />
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
                  onSave={saveNote}
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
