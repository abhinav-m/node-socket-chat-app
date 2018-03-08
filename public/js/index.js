var socket = io();
socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  console.log("Message recieved", message);
  var li = jQuery(`<li></li>`);
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var li = jQuery("<li></li>");
  var a = jQuery("<a target='_blank'>My current location</a>");
  li.text(`${message.from} ${formattedTime}: `);
  a.attr("href", message.url);
  li.append(a);
  jQuery("#messages").append(li);
});

var messageTextBox = jQuery(`[name=message]`);

jQuery("#message-form").on("submit", function(e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val("");
    }
  );
});

var locationButton = jQuery("#send-location");

locationButton.on("click", function() {
  locationButton.attr("disabled", "disabled");
  locationButton.text(" Sending location...");

  if (!navigator.geolocation) {
    return alert("Geolocation not supported on your browser");
  }
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log(position);
      locationButton.removeAttr("disabled");
      locationButton.text("Send location");
    },
    function() {
      alert("unable to fetch location");
      locationButton.removeAttr("disabled");
      locationButton.text("Send location");
    }
  );
});
