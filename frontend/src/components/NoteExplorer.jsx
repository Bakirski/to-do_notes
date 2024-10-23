import React, { useState, useEffect } from "react";
import axios from "axios";

function NoteExplorer(props) {
  //state koji cuva sve naslove notes-a iz baze podataka
  const [titles, setTitles] = useState([]);

  //state koji prima podatke note-a koji se klikne za prikaz
  const [note, setNote] = useState({ title: "", content: "" });

  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  /*
  dohvata sve naslove notes-a koji se nalaze u bazi
  zajedno sa njihovim id-ovima i ubacuje ih u titles 
  useState
  */
  async function getNotes() {
    try {
      const response = await axios.get("http://localhost:4000/get-notes");
      console.log(response.data);
      setTitles(response.data);
      //setTitles(response.data.map((note) => note.title));
    } catch (error) {
      console.error("Error getting notes from database: ", error);
    }
  }

  /*
  dohvata note koji se odabere u exploreru tako sto trazi odgovarajuci index
  poslije toga ubacuje dobijene podatke u note useState
  */
  async function displayNote(id) {
    try {
      const response = await axios.post("http://localhost:4000/display-note", {
        id,
      });
      console.log(response.data[0]);
      setNote({
        title: response.data[0].title,
        content: response.data[0].content,
      });
    } catch (error) {
      console.error("Error fetching note to display: ", error);
    }
  }

  async function fetchNotes() {
    try {
      const response = await axios.get(
        `/user-notes/updated-since/${lastUpdated}`
      );
      const data = response.data;
      console.log(data);
      if (data.length > 0) {
        setTitles((prevTitles) => [...prevTitles, ...data]);
        setLastUpdated(new Date().toISOString());
      }
    } catch (error) {
      console.error("Error fetching updated notes: ", error);
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
