var expect = require("expect");

var {createMessage} = require("./message");

var testText = "abc123abc";
var testFrom = "user1454532"

describe("Testing the message utility", () => {
	it("Should create a message", () => {
		var testMessage = createMessage(testFrom, testText);
		expect(testMessage).toMatchObject({from: testFrom, text: testText});
		expect(typeof testMessage.createdAt).toBe("number");
	});
});
