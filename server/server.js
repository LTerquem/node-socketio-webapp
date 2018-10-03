const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const {createMessage, createLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users")

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "public");

// Server setup
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(publicPath));

var users = new Users();

// Socket.io events
io.on("connection", socket => {
	console.log("New user connected");

	// Make the user join the room	
	socket.on("join", (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback("Name or room name incorrect");
		} 
		socket.joinedRoom = params.room;
		socket.username = params.name;
		socket.join(socket.joinedRoom);

		// Welcome greetings
		socket.emit("newMessage", createMessage("Server","Welcome, new user !"));
		socket.broadcast.to(socket.joinedRoom).emit("newMessage",  createMessage("Server",`${socket.username} joined room ${socket.joinedRoom}`));

		users.removeUser(socket.id);		
		users.addUser(socket.id, params.name, socket.joinedRoom);
		io.to(socket.joinedRoom).emit("updateUserList", users.getUserList(socket.joinedRoom));

		callback()
	});

	// Receiving and broadcasting new messages
	socket.on("createMessage", (message, callback) => {
		var newMessage =  createMessage(socket.username, message.text);
		socket.broadcast.to(socket.joinedRoom).emit("newMessage", newMessage);
		// To also log the message to the sender, with the same timestamp
		newMessage.from = ("You");
		socket.emit("newMessage", newMessage);
		// Callback
		callback();
	});

	// Receiving and broadcasting new location
	socket.on("createLocation", (from, latitude, longitude) => {
		var newLocation = createLocationMessage(socket.username, latitude, longitude);
		socket.broadcast.to(socket.joinedRoom).emit("newLocation", newLocation);
		newLocation.from = ("You");
		socket.emit("newLocation", newLocation);
	});

	socket.on("disconnect", () => {
		var removedUser = users.removeUser(socket.id);

		if (removedUser) {
			io.to(removedUser.room).emit("updateUserList", users.getUserList(removedUser.room));
			io.to(removedUser.room).emit("newMessage", createMessage("Server", `User ${removedUser.name} has disconnected`));
		}
		
	});
});

// Routes

server.listen(port, () => console.log(`Server running on port ${port}`));