import React from "react";

function ToDoItem(props) {
  return (
    <div
      onClick={() => {
        props.onChecked(props.id);
      }}
    >
      <div className="list-item-container">
        <li>{props.text}</li>
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ToDoItem;
