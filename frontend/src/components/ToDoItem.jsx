import React, { useState } from "react";

function ToDoItem(props) {
  const [isLineThrough, setIsLineThrough] = useState(false);

  function handleClick() {
    setIsLineThrough(!isLineThrough);
  }
  /*
          <button
            className="to-do-item-button"
            onClick={() => {
              props.onEdit(props.id);
            }}
          >
            ✏️
          </button>
          */
  return (
    <div>
      <div className="list-item-container">
        <li
          className="left-item"
          onClick={handleClick}
          style={{
            textDecoration: isLineThrough ? "line-through" : "none",
            cursor: "pointer",
          }}
        >
          {props.text}
        </li>
        <div className="to-do-item-buttons">
          <button
            className="to-do-item-button"
            onClick={() => {
              props.onChecked(props.id);
            }}
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToDoItem;
