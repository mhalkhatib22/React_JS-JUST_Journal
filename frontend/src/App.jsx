import React from "react";
import AppRouter from "./AppRouter"; // 👈 Make sure this path points to your router file

function App() {
  return (
    <div className="App">
      {/* The AppRouter component acts as the traffic cop for your entire application */}
      <AppRouter />
    </div>
  );
}

export default App;