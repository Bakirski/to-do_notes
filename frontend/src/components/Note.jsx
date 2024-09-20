import React from "react";

function Note(props) {
  return (
    <div>
      <div className="note-flex-container">
        <h2>{props.title}</h2>
        <p>{props.content}</p>
        <button
          className="edit-button"
          onClick={() => {
            props.onEdit(props.id);
          }}
        >
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => {
            props.onClicked(props.id);
          }}
        >
          Delete
        </button>
        <button
          className="save-button"
          onClick={() => {
            props.onSave();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Note;
