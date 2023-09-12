import React from "react";
import HomePage from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import LandingPage from "./components/LandingPage";
import Waiting from "./components/Waiting";
const socket = io("http://localhost:3001", { transports: ["websocket"] });
socket.connect();

function App() {
  const [message, setMessage] = useState("Waiting for players...");
  const [end, setend] = useState("");
  const [endmessage, setendmessage] = useState("");

  const handleButton = () => {
    socket.emit("refresh", "");
  };

  useEffect(() => {
    socket.on("game_ready", (data: any) => {
      setMessage("start");
    });
    socket.on("end", (data: any) => {
      setend("end");
      setendmessage(data);
    });
  }, []);

  if (message == "start") {
    return (
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage socket={socket} />} />
          </Routes>
        </Router>
        <p>{message}</p>
        <button id="refresh-btn" onClick={() => handleButton()}>
          START
        </button>
      </div>
    );
  } else if (end == "end") {
    return <p>endmessage</p>;
  } else {
    return <Waiting socket={socket} />;
  }
}

export default App;
