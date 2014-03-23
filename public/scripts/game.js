var roomWidth,
	roomLength;
var history = [];
var roomName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

var canvas = null,
	ctx = null,
	width = null,
	height = null;

function clearCanvas() {
	ctx.clearRect(0, 0, 1920, 1080);
}

//Lets paint the snake now
function paint() {
	ctx.fillStyle = 'yellow';
	for (var i = 1; i < history.length; i++) {
		var oldLocation = history[i - 1];
		var currentLocation = history[i];
		paint_path(oldLocation, currentLocation);
	}
}

function paint_cell(x, y) {
	ctx.fillStyle = 'yellow';
	ctx.fillRect(x, y, 25, 25);
}

//Lets first create a generic function to paint cells
function paint_path(oldLocation, currentLocation) {
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.moveTo(oldLocation.x, oldLocation.y);
	ctx.lineTo(currentLocation.x, currentLocation.y);
	ctx.stroke();
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

var watch;

function startGame() {
	if (navigator.geolocation) {
		watch = navigator.geolocation.watchPosition(success, displayError, options);
		renderCanvas();
	}
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function renderCanvas() {
	clearCanvas();
	if (history.length === 1) {
		paint_cell();
	} else {
		paint();
	}
	requestAnimationFrame(renderCanvas);
}

function success(position) {
	console.log(position);
	if (position.coords.longitude < 0) {
		currentLocation.x = 1920 + (position.coords.longitude * 1920 / 90);
	} else {
		currentLocation.x = position.coords.longitude * 1920 / 90;
	}
	currentLocation.x = Math.floor(currentLocation.x % 0.001 * 1000000);
	if (position.coords.latitude < 0) {
		currentLocation.y = 1080 + (position.coords.latitude * 1080 / 180);
	} else {
		currentLocation.y = position.coords.latitude * 1080 / 180;
	}
	currentLocation.y = Math.floor(currentLocation.y % 0.001 * 1000000);
	currentLocation.speed = position.coords.speed;
	currentLocation.accuracy = position.coords.accuracy;
	console.log(currentLocation);
	history.push(currentLocation);
	$('.location-x').text(currentLocation.x);
	$('.location-y').text(currentLocation.y);
	$('.speed').text(currentLocation.speed);
	$('.accuracy').text(currentLocation.accuracy);
	$('.history-length').text(history.length);
};

function displayError(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
};

var socket = io.connect('http://' + window.location.hostname);

$(document).ready(function() {
	canvas = $('canvas');
	ctx = $('canvas')[0].getContext('2d');
	canvasWidth = canvas.width();
	canvasHeight = canvas.height();

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