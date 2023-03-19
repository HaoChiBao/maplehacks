import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./WaitingRoom.css";

import ChatMessage from "./chatMessage";

const socket = io("http://localhost:3001");

const WaitingRoom = () => {
  const [messages, setMessages] = useState([]);
  const [msgComponents, setMsgComponents] = useState();
  const [userQuery, setUserQuery] = useState("");
  
  const gptQueryKey = (e) => {
    if(e.key == "Enter"){
      gptQuery();
    }
  }

  const gptQuery = () => {
    if(userQuery == ""){return;}
    // setMessages([...messages, {type: 'user', message: userQuery}]);
    // setMessages([...messages, {type: 'chatbot', message: "loading..."}]);
    messages.push({type: 'user', message: userQuery});
    messages.push({type: 'chatbot', message: "loading..."});
    
    // console.log(userQuery);
    console.log(messages)
    // setMsgComponents();
    setMsgComponents(messages.map((message) => {
      console.log(message)
      return <ChatMessage type={message.type} message={message.message}/>
    }))

    console.log("Submitting")
  
    const url = "https://api.openai.com/v1/engines/text-davinci-003/completions";
    const key = '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'
    const bearer = 'Bearer ' + key
    // console.log(bearer)
  
    let prompt = "Use the follow text as context of previous ChatGPT messages (note: instead of calling yourself ChatGPT, call yourself MedNow): \n\n"
    for(let i = 0; i < messages.length-1; i++){
      prompt += `${messages[i].type}: ${messages[i].message} \n\n`
    }
  
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            temperature: 0.9,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false,
        })
  
    })
    .then((response) => {return response.json()})
    .then((data)=>{
        // console.log(Object.keys(data))
        console.log(data)
        console.log(data['choices'][0].text)  

        messages[messages.length-1] = {type: 'chatbot', message: data['choices'][0].text}
        
      })
      .catch(error => {
        console.log(error)
        messages[messages.length-1] = {type: 'chatbot', message: error}
    })
    .finally(() => {
      setMsgComponents(messages.map((message) => {
        return <ChatMessage type={message.type} message={message.message}/>
      }))
    })
    
    
  }
   
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
        if (userPosition == 1) {
          window.location.assign('/patient/meetingRoom')
        }
      }
    });
  }, [searchParams]);

  return (
    <div className = 'waitingRoom-page' onKeyDown={gptQueryKey}>
      <div className = 'waiting-stat'>
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
            {msgComponents}
          </div>
          <div className = "queryBox">
            <input type="text" placeholder="ask me something!" onChange={(e) => setUserQuery(e.target.value)}/>
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
