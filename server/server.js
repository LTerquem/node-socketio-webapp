const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

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
	socket.emit("newMessage", {from: "Server", text: "Welcome, new user !", createdAt: new Date().getTime()});
	socket.broadcast.emit("newMessage", {from: "Server", text: "New user has joined !", createdAt: new Date().getTime()});

	// Receiving and broadcasting new messages
	socket.on("createMessage", message => {
		socket.broadcast.emit("newMessage", {
			from : message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	})

	socket.on("disconnect", socket => {
	console.log("User disconnected");
	});
});

// Routes

server.listen(port, () => console.log(`Server running on port ${port}`));