import React from "react";

function Note(props) {
  return (
    <div>
      <div className="note-flex-container">
        <h2>{props.title}</h2>
        <p>{props.content}</p>
        <button
          onClick={() => {
            props.onClicked(props.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Note;
