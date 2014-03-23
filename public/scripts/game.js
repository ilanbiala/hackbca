var roomWidth,
	roomLength;
var history = [];
var roomName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

var canvas = null,
	ctx = null,
	width = null,
	height = null;

function clearCanvas() {
	context.clearRect(0, 0, 1920, 1080);
}

//Lets paint the snake now
function paint() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	ctx.fillStyle = 'yellow';

	for (var i = 0; i < history.length; i++) {
		var location = history[i];
		//Lets paint 10px wide cells
		paint_cell(location.x, location.y);
	}
}

//Lets first create a generic function to paint cells
function paint_cell(x, y) {
	ctx.fillStyle = 'yellow';
	ctx.fillRect(x, y, 25, 25);
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
	currentLocation.y = 111132.954-559.822*Math.cos(2*position.coords.latitude)+1.175*Math.cos(4*position.coords.latitude);
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
	canvas = $('canvas');
	ctx = $('canvas')[0].getContext('2d');
	canvasWidth = canvas.width();
	canvasHeight = canvas.height();

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
