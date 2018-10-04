var socket = io();

socket.on("sendRoomsList", function (roomsList) {
	// var options = jQuery("");
	console.log(roomsList);
	roomsList.forEach(function (room) {
		var option = jQuery("<option></option>");
		option.text(room);
		option.attr("value", room);
		jQuery("#select-room-name").append(option);
	});

});

jQuery("#add-room").on("click", function (e) {
	jQuery("#myModal").css("display","block");
});

jQuery("#modal-back").on("click", function (e) {
	jQuery("#myModal").css("display","none");
});

jQuery("#modal-enter-room").on("click", function (e) {
	var name = jQuery("[name=name]").val();
	var room = jQuery("[name=modal-room]").val().toLowerCase();
	window.location.href = `/chat.html?name=${name}&room=${room}`
	// var name = jQuery("#name").
	// jQuery("#myModal").css("display","block");
});