import AgoraRTC from 'agora-rtc-sdk-ng';

import PatientList from './patientList'

import React, { useEffect, useState } from 'react';
import { VideoPlayer } from './videoPlayer';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
const APP_ID = "fd724da3607e4f568c1775a94077234d";
const TOKEN = "007eJxTYFjpwGwXrVYQIBBycvWT2883rnyw60C0RXnNyms8s9t0TNsVGFLSTJNMUtKMDVPNjE2SkpOT0kxSTMyTUo2MTZMM0lJSDX+LpjQEMjKE2TEyMTJAIIjPxZCbWJCTmpGYnF3MwAAAK8ch2Q=="

const CHANNEL = "maplehacks"


function DoctorDashboard(){
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const isDoctor = localStorage.getItem('maplehacks-isdoctor') == 'true'
    console.log(isDoctor, '- is doctor')

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
            Promise.all([
            AgoraRTC.createMicrophoneAndCameraTracks(),
            uid,
            ])
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
            // console.log(temp, 'temp')
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

    return (
        <div className="video-call">
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            {/* <Gradient></Gradient> */}

            <div className = 'video-container'
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
            </div>
            </div>
            {isDoctor && <PatientList/>}

        </div>
    );
}
export default DoctorDashboard