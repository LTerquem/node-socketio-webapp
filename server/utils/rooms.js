class Rooms {
	constructor() {
		this.rooms = [];
	}

	addRoom(roomName) {
		var newRoom = {
			name: roomName.toLowerCase(),
			people: 0
		}
		this.rooms.push(newRoom);
	}

	addUser(roomName) {
		var room = this.rooms.find( room => room.name === roomName);
		room.people = room.people+1;
	}

	removeUser(roomName) {
		var room = this.rooms.find( room => room.name === roomName);
		room.people = room.people-1;
	}

	getRoom(name) {
		return this.rooms.find(room => room.name === name);
	}

	getRoomsList() {
		return this.rooms.map(room => room.name);
	}
}

module.exports = {Rooms}