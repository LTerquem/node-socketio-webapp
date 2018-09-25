var expect = require("expect");

var {createMessage, createLocationMessage} = require("./message");

var testText = "abc123abc";
var testFrom = "user1454532";
var testLatitude = "100.034523";
var testLongitude = "22.45614564";

describe("Testing createMessage", () => {
	it("Should create a message", () => {
		var testMessage = createMessage(testFrom, testText);
		expect(testMessage).toMatchObject({from: testFrom, text: testText});
		expect(typeof testMessage.createdAt).toBe("number");
	});
});

describe("Testing createLocationMessage", () => {
	it("Should create a locationMessage", () => {
		var testLocationMessage = createLocationMessage(testFrom, testLatitude, testLongitude);
		expect(testLocationMessage).toMatchObject({from: testFrom, url: `https://google.com/maps?q=${testLatitude},${testLongitude}`});
		expect(typeof testLocationMessage.createdAt).toBe("number");
	});
});
