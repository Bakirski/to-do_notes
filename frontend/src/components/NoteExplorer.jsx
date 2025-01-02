import React, { useState, useEffect } from "react";
import axios from "axios";

function NoteExplorer(props) {
  //state koji cuva sve naslove notes-a iz baze podataka
  const [titles, setTitles] = useState([]);

  //state koji prima podatke note-a koji se klikne za prikaz
  const [note, setNote] = useState({ title: "", content: "" });

  const [editingNote, setEditingNote] = useState({id: "", title: "", content: "" });
  /*
  dohvata sve naslove notes-a koji se nalaze u bazi
  zajedno sa njihovim id-ovima i ubacuje ih u titles 
  useState
  */
  async function getNotes() {
    try {
      const response = await axios.get("http://localhost:4000/get-notes", {
        withCredentials: true,
      });
      console.log(response.data);
      setTitles(response.data);
      //setTitles(response.data.map((note) => note.title));
    } catch (error) {
      console.error("Error getting notes from database: ", error);
    }
  }

  async function getNoteById(id) {
    try {
      const response = await axios.post("http://localhost:4000/get-note", { id });
      return response.data[0];
    } catch (error) {
      console.error("Error getting note: ", error);
      return null;
    }
  }
  
  async function displayNote(id) {
    const note = await getNoteById(id);
    if (note) {
      setNote({
        title: note.title,
        content: note.content,
      });
    }
  }
  
  async function fetchNote(id) {
    const note = await getNoteById(id);
    if (note) {
      const fetchedNote = {
        id: note.id,
        title: note.title,
        content: note.content,
      };
      setEditingNote(fetchedNote);
      props.onEdit(fetchedNote);
    }
  }
  
  

  async function deleteNote(id) {
    /*
    napravit delete funkciju da se izbrise note iz
    baze podataka
    */
    try {
      const response = await axios.delete(
        `http://localhost:4000/user-notes/${id}`
      );
      if (response.data.success) {
        console.log("Note deleted successfully.");
      } else {
        console.error("Error deleting note: ", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  }

  /*
  useEffect koji ceka da se note useState promijeni kako bi
  proslijedio taj note glavnoj App componenti
  (note je prazan by default)
  */
  useEffect(() => {
    if (note.title !== "" && note.content !== "") {
      props.addToNotes(note);
    }
  }, [note]);

  /*
  useEffect koji dohvata titlove note-a iz baze kod prvog
  load-a, poslije toga se poziva svaki put kada se desi
  neka promjena u bazi podataka pomocu websocketa
  */
  useEffect(() => {
    getNotes();
    /*const intervalId = setInterval(() => {
      getNotes();
    }, 1000);
    return () => clearInterval(intervalId);
      socket.on("notes-updated", () => {
      getNotes();
    });

    return () => {
      socket.off("notes-updated", () => {
        getNotes();
      });
    };*/
  });

  return (
    <div>
      <div className="notes-explorer-container">
        <h1>{props.name}'s Notes</h1>

        <div>
          <ul>
            {titles.map((item, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      displayNote(item.id);
                    }}
                  >
                    {item.title}
                  </button>
                  <button
                    onClick={() => {
                      deleteNote(item.id);
                    }}
                  >
                    🗑️
                  </button>
                  <button onClick={() => {
                    fetchNote(item.id);
                  }}>✏️</button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NoteExplorer;
