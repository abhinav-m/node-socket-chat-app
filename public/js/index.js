var socket = io();
socket.on("connect", function() {
  console.log("Connected to server");
  socket.emit("createEmail", {
    to: "abc@example.com",
    text: "Hey this is abhinav."
  });

  socket.emit("createMessage", {
    text: "message from client",
    from: "abhinav"
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newEmail", function(email) {
  console.log("New email", email);
});

socket.on("newMessage", function(message) {
  console.log("Message recieved", message);
});
