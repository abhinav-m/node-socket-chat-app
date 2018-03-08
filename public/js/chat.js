var socket = io();

function scrollToBottom() {
  //Selectors
  var messages = jQuery("#messages");
  //Get latest message.
  var newMessage = messages.children("li:last-child");
  //Heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  //Get previous message.
  var lastMessageHeight = newMessage.prev().innerHeight();
  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  //Get the current url params from global window object( to be used as parameters for creating rooms.)
  var params = jQuery.deparam(window.location.search);
  //Creating isolated area (room) for broadcasts
  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("updateUserList", function(users) {
  console.log(users);
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
  scrollToBottom();
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();

  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  jQuery("#messages").append(html);
  scrollToBottom();
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
