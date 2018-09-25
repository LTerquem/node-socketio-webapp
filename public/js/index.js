var socket = io();

// var {createMessage} = require("./../../server/utils/message/js");

socket.on("newMessage", function (message) {
	var li = jQuery("<li></li>");
	li.text(`${message.from} : ${message.text}`);
	jQuery("#messages").append(li);
});

jQuery("#message-form").on("submit", function (e) {
	e.preventDefault();

	socket.emit("createMessage", {
		from: jQuery("[name=username]").val(),
		text:  jQuery("[name=message]").val()
	}, function (data) {
		console.log("Got it ", data);
	});
});

