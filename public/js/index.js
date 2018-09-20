var socket = io();

socket.on("newMessage", function (message) {
	console.log("Message received : ", message);
})