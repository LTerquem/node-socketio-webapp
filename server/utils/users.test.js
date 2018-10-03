const expect = require("expect");

const {Users} = require("./users");

const seedUsers = [{
		id: 1,
		name: "John",
		room: "Room 1"
	}, {
		id: 2,
		name: "Jack",
		room: "Room 2"
	}, {
		id: 3,
		name: "Jaaa",
		room: "Room 1"
	}];

var userList;

describe("Testing Users utilisty", () => {
	beforeEach( () => {
		userList = new Users();
		seedUsers.forEach(user => userList.addUser(user.id, user.name, user.room));
	});

	it("should create a new user", () => {
		var userList = new Users();
		var user = {
			id: "TestID",
			name: "TestName",
			room: "TestRoom"
		}
		expect(userList.users.length).toBe(0);
		var createdUser = userList.addUser(user.id, user.name, user.room);
		expect(userList.users).toMatchObject([user]);
	});

	it("should return Room 1 users", () => {
		var usersInRoom1 = userList.getUserList("Room 1");
		expect(usersInRoom1).toMatchObject(["John", "Jaaa"]);
	});

	it("should return Room 2 users", () => {
		var usersInRoom1 = userList.getUserList("Room 2");
		expect(usersInRoom1).toMatchObject(["Jack"]);
	});

	it("should remove a user", () => {
		userList.removeUser(2);
		expect(userList.users).toMatchObject([seedUsers[0], seedUsers[2]]);
	});

	it("should not remove a user", () => {
		var removedUser = userList.removeUser("azeaz");
		expect(removedUser).toBeUndefined();
		expect(userList.users.length).toBe(3);
	});

	it("should find the user", () => {
		var myUser = userList.getUser(2);
		expect(myUser).toMatchObject(seedUsers[1]);
	});

	it("should not find the user", () => {
		var myUser = userList.getUser(12312);
		expect(myUser).toBeUndefined();
	});

});