// App.js
import React, { useState, useEffect } from "react";
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
  const [editedNote, setEditedNote] = useState({id: "", title: "", content: "" });
  const [showCurrentForm, setShowCurrentForm] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  function handleToggleForm() {
    setShowCurrentForm(false); // Start collapsing out the current form

    // After 500ms (duration of Collapse animation), toggle the form and collapse it in
    setTimeout(() => {
      setSignedUp((prev) => !prev);
      setShowCurrentForm(true); // Collapse in the new form
    }, 300);
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

  function editNote(note) {
    console.log(note);
    setEditedNote({id: note.id, title: note.title, content: note.content });
    console.log(editedNote);

  }

  // Saves note to PostgreSQL database
  async function saveNote(id, title, content) {
    console.log(title, content);
    try {
      const response = await axios.post("http://localhost:4000/notes", {
        id,
        title,
        content,
      }, {withCredentials: true});
      console.log(response);
      deleteNote(id);
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  }

  async function updateNote(note){
    const id = editedNote.id;
    const title = note.title;
    const content = note.content;
    try{
      console.log("Id, title and content: ", id, title, content);
      const response = await axios.patch("http://localhost:4000/update-note", {id, title, content}, {withCredentials: true});
      console.log(response);
    } catch(error){
      console.error("Error updating note: ", error);
    }
  }

  async function userLogout() {
    try {
      const response = await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsAuthenticated(false);
        setUserData(null);
        setSubmittedData(null);
        console.log("User logged out successfully.");
      } else {
        console.error("Failed to log out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/current-user", {
          withCredentials: true,
        });

        if (response.data.name) {
          setSubmittedData(response.data.name);
        } else {
          console.log("User not logged in or session expired");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:4000/protected", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.text();
          setIsAuthenticated(true);
          setUserData(data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if(editedNote.title !== "" && editedNote.content !== ""){
      setEditMode(true);
    }
  },[editedNote]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
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
            setEditMode(false);
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
          <div>
            <div className="logout-button-container">
              <button onClick={userLogout}>Logout</button>
            </div>
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
          </div>
        )
      )}

      {view === "todo" && <ToDo />}
      {view === "notes" && (
        <div>
          <NoteExplorer name={submittedData} addToNotes={addNote} onEdit={editNote} />
          {editMode ? (
            <EditNote
              title={editedNote.title}
              content={editedNote.content}
              onChanged={(note) => {
                updateNote(note);
                setEditMode(false);
              }}
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
