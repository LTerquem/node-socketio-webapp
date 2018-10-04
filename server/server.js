const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const {createMessage, createLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");
const {Rooms} = require("./utils/rooms");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "public");

// Server setup
const app = express();
const server = http.Server(app);
const io = socketIO(server);

var chat = io.of("/chat");
var login = io.of("/");

app.use(express.static(publicPath));

var users = new Users();
var rooms = new Rooms();

// Socket.io events
chat.on("connection", socket => {
	console.log("New user connected");

	// Make the user join the room	
	socket.on("join", (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback("Name or room name incorrect");
		} 
		socket.joinedRoom = params.room.toLowerCase();
		socket.username = params.name;
		socket.join(socket.joinedRoom);

		if (!rooms.getRoom(socket.joinedRoom)) {
			rooms.addRoom(socket.joinedRoom);
		}
		rooms.addUser(socket.joinedRoom);
		console.log(rooms.rooms);

		// Welcome greetings
		socket.emit("newMessage", createMessage("Server","Welcome, new user !"));
		socket.broadcast.to(socket.joinedRoom).emit("newMessage",  createMessage("Server",`${socket.username} joined room ${socket.joinedRoom}`));

		users.removeUser(socket.id);		
		users.addUser(socket.id, params.name, socket.joinedRoom);
		chat.to(socket.joinedRoom).emit("updateUserList", users.getUserList(socket.joinedRoom));

		callback()
	});

	// Receiving and broadcasting new messages
	socket.on("createMessage", (text, callback) => {
		var user = users.getUser(socket.id);
		if (user && isRealString(text)) {
			var newMessage =  createMessage(user.name, text);
			socket.broadcast.to(user.room).emit("newMessage", newMessage);
			newMessage.from = ("You");
			socket.emit("newMessage", newMessage);
			callback();	
		} else {
			callback(); // Faire un callback avec erreur			
		}
	});

	// Receiving and broadcasting new location
	socket.on("createLocation", (latitude, longitude) => {
		var user = users.getUser(socket.id);
		if (user) {
			var newLocation = createLocationMessage(user.name, latitude, longitude);
			socket.broadcast.to(user.room).emit("newLocation", newLocation);
			newLocation.from = ("You");
			socket.emit("newLocation", newLocation);
		}

	});

	socket.on("disconnect", () => {
		var removedUser = users.removeUser(socket.id);

		if (removedUser) {
			chat.to(removedUser.room).emit("updateUserList", users.getUserList(removedUser.room));
			chat.to(removedUser.room).emit("newMessage", createMessage("Server", `User ${removedUser.name} has disconnected`));
		}
		
	});
});

login.on("connection", socket => {
	console.log("New user !");
	socket.emit("sendRoomsList", rooms.getRoomsList());
});
// Routes

server.listen(port, () => console.log(`Server running on port ${port}`));