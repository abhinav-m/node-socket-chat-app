var socket = io();
socket.on("connect", function() {
  console.log("Connected to server");

  socket.emit(
    "createMessage",
    {
      text: "message from client",
      from: "abhinav"
    },
    function(message) {
      console.log("Got from server", message);
    }
  );
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("Message recieved", message);
});
