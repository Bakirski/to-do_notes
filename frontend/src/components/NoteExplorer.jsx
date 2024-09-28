import React, { useState, useEffect } from "react";
import axios from "axios";
function NoteExplorer(props) {
  const [titles, setTitles] = useState([]);
  const [note, setNote] = useState({ title: "", content: "" });
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

  useEffect(() => {
    getNotes();
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
                      props.addToNotes(note);
                    }}
                  >
                    {item.title}
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
