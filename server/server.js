const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

// //One way to access a directory on the same level (such as public in this case.)
// console.log(__dirname + "/../public");

// Another way:
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
//Using express app as the http server Express allows this.
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      //Make sure validtion returns so invalid users / rooms arent created.
      return callback("Name and room name are required.");
    }
    //Joining a private room
    socket.join(params.room);
    //Leaving a room -> socket.leave('room')

    //Make sure no user is present with same id (removes users from previous rooms)
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    //io.emit -> broadcast to every socket (every user) -> io.to('room').emit to a specific room
    //socket.broadcast.emit -> All connected to socket server except current user. socket.broadcast.to('room').emit to a specific room
    //socket.emit -> emit to one user.

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app!")
    );

    //Send info to everybody BUT the socket being used.
    //This will send message to the other tab than the one currently being used.
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined the room.`)
      );

    callback();
  });

  //io.emit broadcasts message to all 'sockets' or users connected (unlike socket.emit)
  //callback function here is the one defined in client (index.js) it can be executed to acknowledge data
  //being successfully transferred between client and server.

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("");
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);
    console.log("The user leaving is:", user.name);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io
        .to(user.room)
        .emit(
          "newMessage",
          generateMessage("Admin", `${user.name} has left the room.`)
        );
    }
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
