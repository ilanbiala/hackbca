var socket;

$(document).ready(function() {
	socket = io.connect(window.location.href);

	$('#initiate-game').on('click', function() {
		var roomName = $('#room-name').val();
		// var personName = $('#player-name').val();
		socket.emit('join_room', {
			room: roomName,
			// nick: personName
		});
		socket.on('room_joined', function(data) {
			var newURL = window.location.href + 'room/' + data.room;
			window.location.href = newURL;
		});
		socket.on('error', function(data) {
			$('body').prepend('<div class="error">' + data.msg + '</div>')
		});
	});
});