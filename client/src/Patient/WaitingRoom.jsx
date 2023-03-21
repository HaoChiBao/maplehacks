import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import "./WaitingRoom.css";

const WaitingRoom = () => {
  const socket = io("http://localhost:3001/");
  const [response, setResponse] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [waitingRoomQueue, setWaitingRoomQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(0);
  const [userJoined, setUserJoined] = useState(false);
  const messages = [];

  const gptQueryKey = (e) => {
    if (e.key === "Enter") {
      gptQuery();
    }
  };

  const gptQuery = () => {
    if (userQuery === "") {
      return;
    }

    messages.push({ type: "user", message: userQuery });
    console.log("Submitting");

    const url =
      "https://api.openai.com/v1/engines/text-davinci-003/completions";
    const key = process.env.REACT_APP_GPT_KEY;
    const bearer = "Bearer " + key;

    let prompt =
      "Use the follow text as context of previous ChatGPT messages (note: instead of calling yourself ChatGPT, call yourself MedNow): \n\n";
    for (let i = 0; i < messages.length; i++) {
      prompt += `${messages[i].type}: ${messages[i].message} \n\n`;
    }
    console.log("Prompt is: ", prompt);

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data["choices"][0].text);
        messages.push({ type: "chatbot", message: data["choices"][0].text });
        setResponse(data["choices"][0].text);
      })
      .catch((error) => {
        console.log(error.message);
        setResponse(error.message);
      });
  };

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
      setWaitingRoomQueue(queue);
      for (let i = 0; i < queue.length; i++) {
        if (queue[i]["socketID"] === searchParams.get("socketID")) {
          setUserPosition(i + 1);
          break;
        }
      }
    });
  }, [searchParams]);

  // listen for the 'connect_to_call' event
  socket.on("connect_to_call", (socketID) => {
    console.log(socketID, searchParams.get("socketID"));
    if (searchParams.get("socketID") === socketID) {
      window.location.assign("/patient/meeting-room");
    }
  });

  return (
    <div className="waitingRoom-page" onKeyDown={gptQueryKey}>
      <div className="waiting-stat">
        <h1>Waiting Room</h1>

        {userPosition >= 0 && (
          <p>Your position in the queue is: {userPosition}</p>
        )}
      </div>

      <div className="gptChat">
        <div className="title">
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
          <div className="chatbox">{response}</div>
          <div className="queryBox">
            <input
              type="text"
              placeholder="How are you feeling?"
              onChange={(e) => setUserQuery(e.target.value)}
            />
            <button onClick={gptQuery}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
