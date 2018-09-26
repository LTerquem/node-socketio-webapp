var socket = io();

// Event listeners
socket.on("newMessage", function (message) {
	var formattedTimeStamp = moment(message.createdAt).format("h:mm a");
	var template = jQuery("#message-template").html();
	var html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formattedTimeStamp
	});
	jQuery("#messages").append(html);
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
})

// Event emitters
var messageTextBox = jQuery("[name=message]");
jQuery("#message-form").on("submit", function (e) {
	e.preventDefault();

	socket.emit("createMessage", {
		from: jQuery("[name=username]").val(),
		text: messageTextBox.val()
	}, function () {
		text: messageTextBox.val("");
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
			jQuery("[name=username]").val(),
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

