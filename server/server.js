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

class User {
  constructor(socketID, name, reason, waitingRoomCount) {
    this.socketID = socketID;
    this.name = name;
    this.reason = reason;
  }
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join_waiting_room", (data) => {
    console.log(`${data.name} joined the waiting room`);

    // add user to the waiting room queue
    waitingRoomQueue.push(new User(data.socketID, data.name, data.reason));
    waitingRoomCount++;
  });

  socket.on("get_queue_position", (user) => {
    let position = 0;

    console.log(waitingRoomQueue);
    console.log("Backend, user is: ", user.socketID);

    const current_user_id = user.socketID;

    for (let i = 0; i < waitingRoomQueue.length; i++) {
      position++;
      if (waitingRoomQueue[i]["socketID"] === current_user_id) {
        break;
      }
    }

    console.log(position);

    io.emit("queue_position", position);
  });

  socket.on("get_waiting_room_count", () => {
    io.emit("waiting_room_count", waitingRoomCount);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
