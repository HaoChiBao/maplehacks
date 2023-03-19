import React from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");

const StartMeeting = () => {
  return (
    <>
      <button className="start" style={{color: "white", backgroundColor: "#7ca1ec", border: "none", outline: "none", padding: "3px", marginRight: "230px", width: "100px", height: "30px", fontSize: "13px"}}
        onClick={() => {
          socket.emit("start-meeting");
        }}
      >
        Start Meeting
      </button>
    </>
  );
};

export default StartMeeting;
