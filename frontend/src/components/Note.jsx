import React from "react";

function Note(props) {
  return (
    <div>
      <div>
        <h1>{props.title}</h1>
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
