import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import TimeCounterVideoApp from "./pages/counter";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TimeCounterVideoApp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
