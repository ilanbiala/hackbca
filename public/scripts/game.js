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
	ctx.fillStyle = "yellow";
	ctx.fillRect(1, 1, x, y);
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
	socket.emit('geodata_receive', {
		data: accel
	});
	history.push(accel);
}

var options = {
	enableHighAccuracy: true,
	timeout: 15000
};

var currentLocation = {
	x: null,
	y: null,
	speed: null,
	accuracy: null
};

function startGame() {
	if (navigator.geolocation) {
		currentLocation = navigator.geolocation.watchPosition(success, displayError, options);
	}
}

function success(position) {
	currentLocation.x = Math.pi/180*6367449*Math.cos(position.coords.longitude);
	currentLocation.y = 111132.954-559.822*Math.cos(2*postion.coords.latitude)+1.175*Math.cos(4*postion.coords.latitude);
	currentLocation.speed = position.coords.speed;
	currentLocation.accuracy = position.coords.accuracy;
	history.push(currentLocation);
	$('.speed').text(currentLocation.speed);
	$('.accuracy').text(currentLocation.accuracy);
};

function displayError(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
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
