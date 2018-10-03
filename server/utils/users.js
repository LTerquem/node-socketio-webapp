class Users {
	constructor () {
		this.users = [];
	}

	addUser (id, name, room) {
		var user = {
			id,
			name,
			room,
		};
		this.users.push(user);
		return user;
	}

	getUser (id) {
		return this.users.find( user => user.id === id);
	}

	removeUser (id) {
		var removedUser = this.getUser(id);
		this.users = this.users.filter( user => user !== removedUser);
		return removedUser;
	}

	getUserList (room) {
		var usersList = [];
		this.users.forEach( user => user.room === room ? usersList.push(user.name) : null);
		return usersList;
	}
}

// users = new Users();
// users.addUser("1", "John", "3");
// users.addUser("4", "Jack", "6");
// users.addUser("7", "Jezbel", "3");
// console.log(users.users);
// console.log("List : ", users.getUserList("3"));

module.exports = {Users};