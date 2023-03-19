import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./WaitingRoom.css";

const socket = io("http://localhost:3001");

const gptQuery = () => {
  console.log("gptQuery");
};

const WaitingRoom = () => {
  const [waitingRoomCount, setWaitingRoomCount] = useState(0);
  const [searchParams] = useSearchParams();
  const [waitingRoomQueue, setWaitingRoomQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(0);
  const [userJoined, setUserJoined] = useState(false);

  useEffect(() => {
    if (!userJoined) {
      socket.emit("join_waiting_room", {
        socketID: searchParams.get("socketID"),
        name: searchParams.get("name"),
        reason: searchParams.get("reason"),
      });
      setUserJoined(true);
    }

    socket.on("patient_queue", (queue) => {
      console.log(queue);
      setWaitingRoomQueue(queue);
      for (let i = 0; i < queue.length; i++) {
        if (queue[i]["socketID"] === searchParams.get("socketID")) {
          setUserPosition(i + 1);
          break;
        }
      }
    });
  }, [searchParams]);

  return (
    <div className="waitingRoom-page">
      <div className="waiting-stat">
        <h1>Waiting Room</h1>

        {userPosition >= 0 && (
          <p>Your position in the queue is: {userPosition}</p>
        )}
      </div>

      <div className="gptChat">
        <div>
          <h1>Chatbot</h1>
          <p>
            While you're waiting, discuss with our chatbot about occurring
            symptoms
          </p>
          <p>
            A copy of the chat's transcript will be sent to your awaited doctor
          </p>
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
          <div className="queryBox">
            <input type="text" placeholder="ask me something!" />
            <button onClick={gptQuery}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;

// socket.on("waiting_room_count", (count) => {
//   setWaitingRoomCount(count);
// });
