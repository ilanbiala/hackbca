var rooms = [];

var receive = function(data) {
	var geodata = {};
	console.log(data);
}

var join_room = function(data) {
	if (rooms.indexOf(data.room) === -1) {
		rooms.push(data.room);
		socket.join(data.room);
	} else if (sockets.clients(data.room) < 2) {
		socket.join(data.room);
	} else {
		socket.emit('error', {
			msg: 'room full'
		});
	}
}
