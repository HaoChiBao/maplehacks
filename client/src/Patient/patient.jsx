import React, { useState, useEffect } from "react";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import './patient.css'

const socket = io("http://localhost:3001");

const Patient = () => {
  // state to set name and reason for user
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const socketID = socket.id;

  const joinRoom = (e) => {
    e.preventDefault();

    socket.emit("join_waiting_room", { name, reason, socketID });

    navigate({
      pathname: "/waiting-room",
      // state: { name, reason, socketID },
      search: createSearchParams({
        name: name,
        reason: reason,
        socketID: socketID,
      }).toString(),
    });
  };

  return (
    
    <div className='patient-page'>
      <div className="form">
          <h1>Tell Us About Yourself</h1>
          <h2>Your Name:</h2>
          <input 
              type="text" 
              onChange={(e) => setName(e.target.value)}/>
          <h2>Reason for Meeting:</h2>
          <input 
              type="reason" 
              onChange={(e) => setReason(e.target.value)}/>
          <button onClick={joinRoom}>Submit</button>
      </div>
    </div>
  );
};

export default Patient;
