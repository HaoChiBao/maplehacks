import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import io from "socket.io-client";
import "./WaitingRoom.css";

import ChatMessage from "./chatMessage";

const socket = io("http://localhost:3001");

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
const APP_ID = "fd724da3607e4f568c1775a94077234d";
const TOKEN =
  "007eJxTYFjpwGwXrVYQIBBycvWT2883rnyw60C0RXnNyms8s9t0TNsVGFLSTJNMUtKMDVPNjE2SkpOT0kxSTMyTUo2MTZMM0lJSDX+LpjQEMjKE2TEyMTJAIIjPxZCbWJCTmpGYnF3MwAAAK8ch2Q==";

const CHANNEL = "maplehacks";

const WaitingRoom = () => {
  const [messages, setMessages] = useState([]);
  const [msgComponents, setMsgComponents] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [waitingRoomCount, setWaitingRoomCount] = useState(0);
  const [searchParams] = useSearchParams();
  const [waitingRoomQueue, setWaitingRoomQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(0);
  const [userJoined, setUserJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

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
    // const key = process.env.GPT_KEY;
    const key = "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";
    // console.log("Key is: ", key);
    const bearer = "Bearer " + key;
    // console.log(bearer)

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
        // console.log(Object.keys(data))
        console.log(data);
        console.log(data["choices"][0].text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "chatbot", message: data["choices"][0].text },
        ]);
        console.log(messages);
      })
      .catch((error) => {
        console.log(error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "chatbot", message: error },
        ]);
      });
  };

  useEffect(() => {
    let components = messages.map((message, index) => {
      return (
        <ChatMessage
          key={index}
          type={message["type"]}
          message={message["message"]}
        />
      );
    });
    setMsgComponents(components);

    console.log("Message components is: , ", msgComponents);
  }, [messages]);

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

  // listen for the 'connect_to_call' event
  socket.on("connect_to_call", () => {
    window.location.assign("/doctor/dashboard");
    // create a new client object
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    // join the channel using the client object
    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
        let temp = null;
        temp = tracks;
        // console.log(temp, 'temp')
      });
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
          <div className="chatbox">{msgComponents}</div>
          <div className="queryBox">
            <input
              type="text"
              placeholder="ask me something!"
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
