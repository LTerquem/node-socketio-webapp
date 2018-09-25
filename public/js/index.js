var socket = io();

// Event listeners
socket.on("newMessage", function (message) {
	var li = jQuery("<li></li>");
	li.text(`${message.from} : ${message.text}`);
	jQuery("#messages").append(li);
});

socket.on("newLocation", function (message) {
	console.log(message);
	var li = jQuery(`<li></li>`);
	var a = jQuery("<a target='_blank'>My current location</a>");

	li.text(`${message.from} : `);
	a.attr("href", message.url);

	li.append(a);
	jQuery("#messages").append(li);
})

// Event emitters
jQuery("#message-form").on("submit", function (e) {
	e.preventDefault();

	socket.emit("createMessage", {
		from: jQuery("[name=username]").val(),
		text:  jQuery("[name=message]").val()
	}, function (data) {
		console.log("Got it ", data);
	});
});

var sendLocationButton = jQuery("#send-location");
sendLocationButton.on("click", function (e) {
	if (!navigator.geolocation) {
		return alert("Browser not compatible with geolocation");
	}
	navigator.geolocation.getCurrentPosition( function (position) {
		socket.emit("createLocation",
			jQuery("[name=username]").val(),
			position.coords.latitude,
			position.coords.longitude);
	}, function () {
		alert("Unable to fetch current location.");
	})
});

