import React, { useState } from "react";
function CreateNote(props) {
  const [noteItem, setNoteItem] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNoteItem({
      ...noteItem,
      [name]: value,
    });
  }

  return (
    <div>
      <div className="create-note-container">
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={noteItem.title}
        />
        <textarea
          type="text"
          rows="3"
          placeholder="Take A Note..."
          name="content"
          onChange={handleChange}
          value={noteItem.content}
        />
        <button
          className="create-note-button"
          onClick={() => {
            props.onAdd(noteItem);
            setNoteItem({
              title: "",
              content: "",
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default CreateNote;
