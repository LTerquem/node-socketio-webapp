var socket = io("/chat");

// Functions
function scrollToBottom () {
	// Selectors
	var messages = jQuery("#messages");
	var newMessage = messages.children("li:last-child");
	// Variables
	var clientHeight = messages.prop("clientHeight");
	var scrollHeight = messages.prop("scrollHeight");
	var scrollTop = messages.prop("scrollTop");
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight+scrollTop+newMessageHeight+2*lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

// Event listeners
socket.on("connect", function () {
	var params = jQuery.deparam(window.location.search);
	socket.emit("join", params, function (err) {
		if (err) {
			alert(err);
			window.location.href = "/";
		} else {
			socket.joinedRoom = params.room;
			socket.username = params.name;
			jQuery("#room-name").text(socket.joinedRoom.toUpperCase());
		}
	})
});

socket.on("newMessage", function (message) {
	var formattedTimeStamp = moment(message.createdAt).format("h:mm a");
	var template = jQuery("#message-template").html();
	var html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formattedTimeStamp
	});
	jQuery("#messages").append(html);
	scrollToBottom();
});

socket.on("newLocation", function (message) {
	var formattedTimeStamp = moment(message.createdAt).format("h:mm a");
	var template = jQuery("#location-template").html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTimeStamp
	});
	jQuery("#messages").append(html);
	scrollToBottom();
});

socket.on("updateUserList", function(newUserList) {
	var ol = jQuery("<ol></ol>")
	newUserList.forEach( function (user) {
		var li = jQuery("<li></li>");
		li.text(user);
		ol.append(li);
	});
	jQuery("#userList").html(ol);
});

// Event emitters
var messageTextBox = jQuery("[name=message]");
jQuery("#message-form").on("submit", function (e) {
	e.preventDefault();

	socket.emit("createMessage", messageTextBox.val(), function () {
		return messageTextBox.val("");
	});
});

var sendLocationButton = jQuery("#send-location");
sendLocationButton.on("click", function (e) {
	if (!navigator.geolocation) {
		return alert("Browser not compatible with geolocation");
	}
	sendLocationButton.attr("disabled", "true");
	sendLocationButton.text("Sending location ...");
	navigator.geolocation.getCurrentPosition( function (position) {
		socket.emit("createLocation",
			position.coords.latitude,
			position.coords.longitude);
		sendLocationButton.removeAttr("disabled");
		sendLocationButton.text("Send location");
	}, function () {
		sendLocationButton.attr(disabled="false");
		sendLocationButton.text("Send location");
		alert("Unable to fetch current location.");
	});
});

