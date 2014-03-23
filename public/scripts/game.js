var accel = {
	x: null,
	y: null,
	z: null
};
var roomWidth,
	roomLength;
var history = [];
var roomName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

//Lets paint the snake now
function paint() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);

	for (var i = 0; i < snake_array.length; i++) {
		var c = snake_array[i];
		//Lets paint 10px wide cells
		paint_cell(c.x, c.y);
	}
}

//Lets first create a generic function to paint cells
function paint_cell(x, y) {
	ctx.fillStyle = "blue";
	ctx.fillRect(x * cw, y * cw, cw, cw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x * cw, y * cw, cw, cw);
}

function check_collision(x, y, array) {
	//This function will check if the provided x/y coordinates exist
	//in an array of cells or not
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == x && array[i].y == y)
			return true;
	}
	return false;
}

function handleDeviceMotion(eventData) {

	// Grab the acceleration including gravity from the results
	var acceleration = eventData.accelerationIncludingGravity;
	accel.x = acceleration.x.toFixed(3);
	accel.y = acceleration.y.toFixed(3);
	accel.z = acceleration.z.toFixed(3);

	var accelString = '';
	accelString += 'landscape/portrait: ' + accel.x + '<br>';
	accelString += 'parallax: ' + accel.y + '<br>';
	accelString += 'up/down: ' + accel.z + '<br>';
	$('.accel').html(accelString);
	socket.emit('geodata_receive', {
		data: accel
	});
	history.push(accel);
}

function startGame() {
	if (navigator.geolocation) {
		id = navigator.geolocation.watchPosition(success, error, options);
	}
}

var id,
	target,
	option;

function success(pos) {
	var crd = pos.coords;

	if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
		console.log('Congratulation, you reach the target');
		navigator.geolocation.clearWatch(id);
	}
};

function error(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
};

target = {
	latitude: 0,
	longitude: 0,
}

options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

$(document).ready(function() {
	var canvas = $('canvas'),
		ctx = canvas[0].getContext('2d'),
		width = canvas.width(),
		height = canvas.height();

	socket = io.connect('http://' + window.location.hostname);
	socket.emit('enter_room', {
		room: roomName
	});

	socket.on('room_entered', function(data) {
		if (data.requestArea) {
			$('#gameModal').modal('show');
			$('#startGame').on('click', function() {
				roomLength = $('#room-length').val();
				roomWidth = $('#room-width').val();
				if (!(roomWidth.length > 0 && roomLength.length > 0)) {
					return false;
				}
				socket.emit('start_game', {

				});
				$('#gameModal').modal('hide');
			});
		}
	});

	socket.on('game_started', function() {
		startGame();
	});
});