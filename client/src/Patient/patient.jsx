import React, { useState, useEffect } from "react";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

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
    <>
      <form onSubmit={joinRoom}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="reason">Reason:</label>
          <input
            type="text"
            id="reason"
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Patient;
