const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const {createMessage, createLocationMessage} = require("./utils/message");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "public");

// Server setup
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(publicPath));

// Socket.io events
io.on("connection", socket => {
	console.log("New user connected");

	// Welcome greetings
	socket.emit("newMessage", createMessage("Server","Welcome, new user !"));
	socket.broadcast.emit("newMessage",  createMessage("Server","New user has joined !"));

	// Receiving and broadcasting new messages
	socket.on("createMessage", (message, callback) => {
		var newMessage =  createMessage(message.from, message.text);
		socket.broadcast.emit("newMessage", newMessage);
		// To also log the message to the sender, with the same timestamp
		newMessage.from = ("You");
		socket.emit("newMessage", newMessage);
		// Callback
		callback();
	});

	// Receiving and broadcasting new location
	socket.on("createLocation", (from, latitude, longitude) => {
		var newLocation = createLocationMessage(from, latitude, longitude);
		socket.broadcast.emit("newLocation", newLocation);
		newLocation.from = ("You");
		socket.emit("newLocation", newLocation);
	})

	socket.on("disconnect", socket => {
	console.log("User disconnected");
	});
});

// Routes

server.listen(port, () => console.log(`Server running on port ${port}`));