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

  // connect first user in queue to call
  socket.on("start_meeting", () => {
    if (waitingRoomQueue.length > 0) {
      console.log("BEFORE: ", waitingRoomQueue);
      const user = waitingRoomQueue.shift();
      console.log("The user removed is: ", user); // remove the first user in the queue
      connectedClients.delete(user.socketID); // remove the user from the connected clients

      // update the position of all users in the queue
      waitingRoomQueue.forEach((user, index) => {
        user["position"] -= 1;
      });

      console.log("AFTER: ", waitingRoomQueue);

      // emit the updated patient queue and waiting room count to all clients
      io.emit("patient_queue", waitingRoomQueue);
      io.emit("waiting_room_count", --waitingRoomCount);

      // emit the "connect_to_call" event to the user who was removed from the queue
      io.emit("connect_to_call", user.socketID);
    }
  });

  // remove the user from the waiting room queue when the user disconnects
  socket.on("disconnect", () => {
    const current_user_id = socket.id;
    console.log("a user disconnected");

    for (const [socketID, user] of connectedClients) {
      if (socketID === current_user_id) {
        waitingRoomQueue.splice(user.position - 1, 1);
        connectedClients.delete(socketID);
        break;
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
