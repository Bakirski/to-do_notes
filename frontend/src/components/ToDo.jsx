import React, { useState } from "react";
import InputArea from "./InputArea.jsx";
import ToDoItem from "./ToDoItem.jsx";
function ToDo() {
  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems((prevItems) => {
      return [...prevItems, inputText];
    });
  }

  function deleteItem(id) {
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
  }
  return (
    <div className="to-do-list">
      <div className="to-do-list-container">
        <div>
          <h1>To-Do List</h1>
          <InputArea onAdd={addItem} />
        </div>
        <div className="to-do-items">
          <ul>
            {items.map((todoItem, index) => (
              <ToDoItem
                key={index}
                id={index}
                text={todoItem}
                onChecked={deleteItem}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ToDo;
