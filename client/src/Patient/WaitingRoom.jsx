import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./WaitingRoom.css";

const socket = io("http://localhost:3001");

const gptQuery = () => {
  console.log("gptQuery")
}

const WaitingRoom = () => {
  const [waitingRoomCount, setWaitingRoomCount] = useState(0);
  const [position, setPosition] = useState(-1);
  //   const { state } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    socket.emit("get_waiting_room_count");
    socket.on("waiting_room_count", (count) => {
      setWaitingRoomCount(count);
    });

    console.log(searchParams.get("name"), searchParams.get("socketID"));

    if (searchParams) {
      socket.emit("get_queue_position", {
        socketID: searchParams.get("socketID"),
      });
      socket.on("queue_position", (position) => {
        console.log(position);
        setPosition(position);
      });
    }
  }, [searchParams]);

  return (
    <div className = 'waitingRoom-page'>
      <div className = 'waiting-stat'>
        <h1>Waiting Room</h1>
        <p>
          There are currently {waitingRoomCount} people in the waiting room.
        </p>
        {position && <p>Your position in the waiting room is: {position}</p>}
      </div>

      <div className = 'gptChat'>
        <div>
          <h1>Chatbot</h1>
          <p>While you're waiting, discuss with our chatbot about occurring symptoms</p>
          <p>A copy of the chat's transcript will be sent to your awaited doctor</p>
        </div>
        
        <div className="chatarea">

          <div className="chatbox">

            <div className="chatbot">
              <div className="message">
                <p>Hi, I'm your chatbot. How can I help you?</p>
              </div>
            </div>
            <div className="user">
              <div className="message">
                <p>Hi, I'm your user</p>
              </div>
            </div>

          </div>
          <div className = "queryBox">
            <input type="text" placeholder="ask me something!" />
            <button onClick={gptQuery}>Send</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WaitingRoom;
