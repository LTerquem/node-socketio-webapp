var socket = io();

socket.on("connect", function () {

	console.log("Connected to the server");

});


socket.emit("createMessage", {from: "UserName2", text: "My Message2"});

socket.on("newMessage", function (message) {
	console.log("Message received : ", message.from, message.text);
})