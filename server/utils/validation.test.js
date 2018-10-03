var expect = require("expect");

var {isRealString} = require("./validation");

describe("Testing validation utility", () => {
	it("should not validate an empty string", () => {
		expect(isRealString("       ")).toBeFalse;
		expect(isRealString("")).toBeFalse;
	});

	it("should not validate an integer", () => {
		expect(isRealString(9)).toBeFalse;
	});

	it("should validate real strings", () => {
		expect(isRealString("aze")).toBeTrue;
		expect(isRealString("    a   ")).toBeTrue;
		expect(isRealString("12332")).toBeTrue;
	});
});