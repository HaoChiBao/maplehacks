import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

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
        console.log(
          "we are here in the front end: ",
          i,
          queue[i],
          queue[i]["socketID"],
          searchParams.get("socketID")
        );
        if (queue[i]["socketID"] === searchParams.get("socketID")) {
          setUserPosition(i + 1);
          break;
        }
      }
    });
  }, [searchParams]);

  return (
    <>
      <div>
        <h1>Waiting Room</h1>
        {/* <p>
          There are currently {waitingRoomCount} people in the waiting room.
        </p> */}

        {userPosition >= 0 && (
          <p>Your position in the queue is: {userPosition}</p>
        )}
      </div>
    </>
  );
};

export default WaitingRoom;

// socket.on("waiting_room_count", (count) => {
//   setWaitingRoomCount(count);
// });
