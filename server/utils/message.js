var createMessage = (from, text) => {
	var message = {
			from,
			text,
			createdAt: new Date().getTime()
	}
	return message;
};

var createLocationMessage = (from, latitude, longitude) => {
	var message = {
		from,
		url: `https://google.com/maps?q=${latitude},${longitude}`,
		createdAt: new Date().getTime()
	}
	return message;
}

module.exports = {createMessage, createLocationMessage}