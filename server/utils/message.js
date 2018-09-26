var moment = require("moment");

var createMessage = (from, text) => {
	var message = {
			from,
			text,
			createdAt: moment().valueOf()
	}
	return message;
};

var createLocationMessage = (from, latitude, longitude) => {
	var message = {
		from,
		url: `https://google.com/maps?q=${latitude},${longitude}`,
		createdAt: moment().valueOf()
	}
	return message;
}

module.exports = {createMessage, createLocationMessage}