import React, { useState } from "react";

function InputArea(props) {
  const [inputText, setInputText] = useState("");

  function handleChange(event) {
    setInputText(event.target.value);
  }

  return (
    <div className="item-add">
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Add an Item..."
      />
      <button
        onClick={() => {
          props.onAdd(inputText);
          setInputText("");
        }}
      >
        +
      </button>
    </div>
  );
}

export default InputArea;
