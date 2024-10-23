import React, { useState, useEffect } from "react";
import InputArea from "./InputArea.jsx";
import ToDoItem from "./ToDoItem.jsx";
import axios from "axios";
function ToDo() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("daily");

  async function saveItem(inputText) {
    try {
      const response = await axios.post("http://localhost:4000/save-to-do", {
        inputText,
        type,
      });
      console.log(response.data[0]);
      const newItem = response.data;
      console.log(newItem);
      setItems((prevItems) => [...prevItems, newItem]);
    } catch (error) {
      console.error("Error saving item from to-do list: ", error);
    }
  }

  async function fetchItems() {
    try {
      const response = await axios.get("http://localhost:4000/fetch-items");

      setItems(response.data);
    } catch (error) {
      console.log("Error getting items from database: ", error);
    }
  }

  async function typeToggle(event) {
    let value = event.target.value;
    setType(value);
    console.log("type changed successfully");
    try {
      const response = await axios.get("http://localhost:4000/filter-notes", {
        params: { listType: value },
      });
      console.log(response.data);
      setItems(response.data);
    } catch (error) {
      console.error("Error getting back filtered notes: ", error);
    }
  }

  //brise item kada se klikne
  /*function deleteItem(id) {
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
  }*/

  async function deleteItem(id) {
    try {
      const response = await axios.delete(
        `http://localhost:4000/delete-item/${id}`
      );
      setItems(items.filter((item) => item.id !== id));
      console.log(response.message);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [type]);

  return (
    <div className="to-do-list">
      <div className="to-do-list-container">
        <div className="to-do-buttons">
          <button className="to-do-button" value="daily" onClick={typeToggle}>
            Daily
          </button>
          <button className="to-do-button" value="weekly" onClick={typeToggle}>
            Weekly
          </button>
          <button className="to-do-button" value="monthly" onClick={typeToggle}>
            Monthly
          </button>
        </div>
        <div>
          <h1>To-Do List</h1>
          <InputArea saveNote={saveItem} />
        </div>
        <div className="to-do-items">
          <ul>
            {items.map((todoItem, index) => (
              <ToDoItem
                key={index}
                id={todoItem.id}
                text={todoItem.to_do_item}
                onChecked={() => {
                  deleteItem(todoItem.id);
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ToDo;
