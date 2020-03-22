import React from "react";
import "./App.css";
import Terminal from "./components/Terminal/Terminal";

function App() {
    return (
        <div className="App">
            <Terminal uri="ws://localhost:13337" />
        </div>
    );
}

export default App;
