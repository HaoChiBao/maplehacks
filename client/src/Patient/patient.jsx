import React, { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Patient.css";

const Patient = () => {
  const [name, setName] = useState("");
  const [socketID, setSocketID] = useState();
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:3001/");
    socket.on("connect", () => {
      setSocketID(socket.id);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = (e) => {
    e.preventDefault();
    navigate({
      pathname: "/waiting-room",
      search: createSearchParams({
        name: name,
        reason: reason,
        socketID: socketID,
      }).toString(),
    });
  };

  return (
    <div className="patient-page">
      <div className="form">
        <h1>Tell Us About Yourself</h1>
        <h2>Full Name:</h2>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <h2>Reason for Meeting:</h2>
        <input type="text" onChange={(e) => setReason(e.target.value)} />
        <button onClick={joinRoom}>Submit</button>
      </div>
    </div>
  );
};

export default Patient;
