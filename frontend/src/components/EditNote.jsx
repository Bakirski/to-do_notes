import React, { useState } from "react";

function EditNote(props) {
  //const editMode = false;
  const [noteItem, setNoteItem] = useState({
    title: props.title,
    content: props.content,
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
      <div className="flex-container">
        <div className="create-note-container">
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={noteItem.title}
          />
          <textarea
            type="text"
            rows="3"
            name="content"
            onChange={handleChange}
            value={noteItem.content}
          />
          <button
            className="create-note-button"
            onClick={() => {
              props.onChanged(noteItem);
              setNoteItem({
                title: "",
                content: "",
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditNote;
