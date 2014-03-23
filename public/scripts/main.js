var socket;

$(document).ready(function() {
	socket = io.connect('http://localhost/');

	$('#initiate-game').on('click', function() {
		var roomName = $('#room-name').val();
		var personName = $('#player-name').val();
		socket.emit('join_room', {
			room: roomName,
			nick: personName
		});
		socket.on('room_joined', function() {

		});
		socket.on('error', function() {

		});
	});
});