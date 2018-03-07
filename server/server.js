const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

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

  socket.on("disconnect", socket => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
