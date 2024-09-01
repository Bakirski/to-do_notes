import React from "react";
function Header(props) {
  return (
    <header>
      <h1 className="firstHeader">Welcome, {props.name}!</h1>
    </header>
  );
}

export default Header;
