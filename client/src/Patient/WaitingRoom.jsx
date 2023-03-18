import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

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
    <>
      <div>
        <h1>Waiting Room</h1>
        <p>
          There are currently {waitingRoomCount} people in the waiting room.
        </p>
        {position && <p>Your position in the waiting room is: {position}</p>}
      </div>
    </>
  );
};

export default WaitingRoom;
