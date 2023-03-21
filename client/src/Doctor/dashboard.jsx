import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import io from "socket.io-client";
import PatientList from "./PatientList";
import "./Dashboard.css";
import StartMeeting from "./StartMeeting";
import { VideoPlayer } from "./VideoPlayer";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
// const APP_ID = process.env.REACT_APP_AGORA_APP_ID;
// const TOKEN = process.env.REACT_APP_AGORA_TOKEN;
// console.log("Dashboard: ", APP_ID, " ", TOKEN);
const APP_ID = "26ab5f3053b0426e8528790f4bbb49aa";
const TOKEN =
  "007eJxTYLhfmR+zr6OwfMPzIp2Shfm3Q/fm2DhMTazzOssgPbeu8boCg5FZYpJpmrGBqXGSgYmRWaqFqZGFuaVBmklSUpKJZWKi8X+JlIZARobTIRMZGRkgEMTnZnDJTy7JL9J1TszJYWAAAEyFIek=";
const CHANNEL = "Doctor-Call";

const socket = io("http://localhost:3001/");

const DoctorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  // const [token, setToken] = useState(null);

  // useEffect(() => {
  //   // Generate temporary token
  //   fetch("/generate-token", {
  //     method: "POST",
  //     body: JSON.stringify({ CHANNEL }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Set the temporary token
  //       setToken(data.token);
  //     });
  // }, [CHANNEL]);

  // Join the channel with the temporary token
  // client.join(APP_ID, CHANNEL, TOKEN);

  const isDoctor = localStorage.getItem("maplehacks-isdoctor") === "true";
  console.log(isDoctor, "- is doctor");

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  let temp = null;

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

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
        temp = tracks;
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(temp).then(() => client.leave());
    };
  }, []);

  const [videoIcon, setVideoIcon] = useState(
    "https://www.svgrepo.com/show/310197/video.svg"
  );
  const [audioIcon, setAudioIcon] = useState(
    "https://www.svgrepo.com/show/309778/mic-on.svg"
  );
  const [exitIcon, setExitIcon] = useState(
    "https://www.svgrepo.com/show/309378/call-outbound.svg"
  );

  const handleStartMeeting = () => {
    socket.emit("start_meeting");
  };

  return (
    <div
      className="video-call"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="video-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 40vw)",
            marginRight: "1vw",
            columnGap: "1vw",
            rowGap: "5vw",
          }}
        >
          {users.map((user) => (
            <VideoPlayer key={user.uid} user={user} />
          ))}
          <div className="video-buttons">
            <button
              onClick={() => {
                console.log(localTracks);
                const videoTrack = localTracks[1];
                videoTrack.setEnabled(!videoTrack.enabled);
                if (videoTrack.enabled) {
                  setVideoIcon(
                    "https://www.svgrepo.com/show/310199/video-off.svg"
                  );
                } else {
                  setVideoIcon("https://www.svgrepo.com/show/310197/video.svg");
                }
              }}
            >
              <img src={videoIcon} />
            </button>
            <button
              onClick={() => {
                const audioTrack = localTracks[0];
                audioTrack.setEnabled(!audioTrack.enabled);
                if (audioTrack.enabled) {
                  setAudioIcon(
                    "https://www.svgrepo.com/show/309777/mic-off.svg"
                  );
                } else {
                  setAudioIcon(
                    "https://www.svgrepo.com/show/309778/mic-on.svg"
                  );
                }
              }}
            >
              <img src={audioIcon} />
            </button>

            <button
              onClick={() => {
                for (let localTrack of localTracks) {
                  localTrack.stop();
                  localTrack.close();
                }
                client.off("user-published", handleUserJoined);
                client.off("user-left", handleUserLeft);
                client.unpublish(temp).then(() => client.leave());
                window.location.assign("/doctor/exit");
              }}
            >
              <img src={exitIcon} />
            </button>
          </div>
        </div>
      </div>
      {isDoctor && <PatientList />}
      <div onClick={handleStartMeeting}>{<StartMeeting />}</div>
    </div>
  );
};

export default DoctorDashboard;
