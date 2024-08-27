import React from "react";

function LandingPage() {
  return (
    <div>
      <form action="/register" method="GET">
        <input type="submit" value="Register" />
      </form>
      <form action="/login" method="GET">
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default LandingPage;
