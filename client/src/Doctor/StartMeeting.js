import React from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");

const StartMeeting = () => {
  return (
    <>
      <button className="start" style={{color: "white", backgroundColor: "#7ca1ec", border: "none", outline: "none", padding: "3px", marginRight: "230px", width: "200px", height: "50px", fontSize: "20px"}}
        onClick={() => {
          socket.emit("start-meeting");
        }}
      >
        Add Next Patient
      </button>
    </>
  );
};

export default StartMeeting;
