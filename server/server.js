const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 15000,
});
const PORT = process.env.PORT || 3001;

let waitingRoomCount = 0;
let waitingRoomQueue = [];
let connectedClients = new Map();

class User {
  constructor(socketID, name, reason, waitingRoomCount) {
    this.socketID = socketID;
    this.name = name;
    this.reason = reason;
    this.position = 0;
  }
}

io.on("connection", (socket) => {
  socket.on("join_waiting_room", (data) => {
    console.log(`${data.name} joined the waiting room`);

    const newPatient = new User(
      data.socketID,
      data.name,
      data.reason,
      waitingRoomQueue.length + 1
    );

    // add user to the waiting room queue
    waitingRoomQueue.push(newPatient);
    waitingRoomCount++;

    connectedClients.set(socket.id, newPatient);
    // emit the updated patient queue and new user's position to all clients
    io.emit("patient_queue", waitingRoomQueue);
    io.emit("waiting_room_count", waitingRoomCount);
  });

  socket.on("get_patient_queue", () => {
    io.emit("patient_queue", waitingRoomQueue);
  });

  socket.on("get_waiting_room_count", () => {
    io.emit("waiting_room_count", waitingRoomCount);
  });

  // remove the user from the waiting room queue when the user disconnects
  socket.on("disconnect", () => {
    console.log(waitingRoomQueue);
    console.log(connectedClients);
    const current_user_id = socket.id;
    console.log("a user disconnected");
    console.log(current_user_id);

    for (const [socketID, user] of connectedClients) {
      if (socketID === current_user_id) {
        waitingRoomQueue.splice(user.position - 1, 1);
        connectedClients.delete(socketID);
      }
    }

    // update the position of all users in the queue
    waitingRoomQueue.forEach((user, index) => {
      user.position--;
    });

    // emit the updated patient queue to all clients
    io.emit("patient_queue", waitingRoomQueue);
    io.emit("waiting_room_count", --waitingRoomCount);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// socket.on("get_queue_position", (user) => {
//   let position = 0;

//   const current_user_id = user.socketID;

//   for (let i = 0; i < waitingRoomQueue.length; i++) {
//     position = i + 1;
//     if (waitingRoomQueue[i]["socketID"] === current_user_id) {
//       break;
//     }
//   }

//   io.emit("queue_position", position);
// });

// socket.on("leave_waiting_room", (user) => {
//   const current_user_id = user.socketID;
//   console.log("a user disconnected");

//   // remove the user from the waiting room queue
//   waitingRoomQueue = waitingRoomQueue.filter(
//     (user) => user["socketID"] !== current_user_id
//   );
//   waitingRoomCount--;

//   // emit the updated patient queue to all clients
//   io.emit("patient_queue", waitingRoomQueue);
//   io.emit("waiting_room_count", waitingRoomCount);
// });
