var socket = io();
socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  var template = jQuery("#message-template").html();
  var formattedTime = moment(message.createdAt).format("h:mm a");

  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);

});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();

  var html = Mustache.render(template, {
    from:message.from,
    createdAt:formattedTime,
    url:message.url

  });
  jQuery("#messages").append(html);

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
