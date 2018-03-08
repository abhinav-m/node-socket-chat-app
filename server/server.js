const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");

// //One way to access a directory on the same level (such as public in this case.)
// console.log(__dirname + "/../public");

// Another way:
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
//Using express app as the http server Express allows this.
const server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app!")
  );

  //Send info to everybody BUT the socket being used.
  //This will send message to the other tab than the one currently being used.
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined!")
  );

  //io.emit broadcasts message to all 'sockets' or users connected (unlike socket.emit)
  //callback function here is the one defined in client (index.js) it can be executed to acknowledge data
  //being successfully transferred between client and server.

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("Got it");
  });

  socket.on("disconnect", socket => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
