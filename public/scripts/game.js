var roomWidth,
	roomLength;
var history = [];
var enemyHistory = [];
var roomName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

var canvas = null,
	ctx = null,
	width = null,
	height = null;

var currentLat = null,
	currentLong = null;

function clearCanvas() {
	ctx.clearRect(0, 0, 1920, 1080);
}

function paintUser() {
	ctx.strokeStyle = 'blue';
	for (var i = 1; i < history.length; i++) {
		var oldLocation = history[i - 1];
		var newLocation = history[i];
		paint_path(oldLocation, newLocation);
	}
}

function paintEnemy() {
	ctx.strokeStyle = 'red';
	for (var i = 1; i < enemyHistory.length; i++) {
		var oldLocation = enemyHistory[i - 1];
		var newLocation = enemyHistory[i];
		paint_path(oldLocation, newLocation);
	}
}

function paint_cell(x, y) {
	ctx.fillStyle = 'yellow';
	ctx.fillRect(x, y, 25, 25);
}

function paint_path(oldLocation, newLocation) {
	ctx.lineWidth = 10;
	ctx.beginPath();
	// console.log('old location: ' + oldLocation.x, oldLocation.y);
	// console.log('current locaiton: ' + currentLocation.x, currentLocation.y);
	ctx.moveTo(oldLocation.x, oldLocation.y);
	ctx.lineTo(newLocation.x, newLocation.y);
	ctx.stroke();
}

function check_collision(x, y, array) {
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
	timeout: 20000
};

var watch;

function startGame() {
	if (navigator.geolocation) {
		watch = navigator.geolocation.watchPosition(success, displayError, options);
	}
	renderCanvas();
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function renderCanvas() {
	clearCanvas();
	if (history.length == 1) {
		paint_cell(history[0].x, history[0].y);
	} else {
		paintUser();
	}
	socket.emit('geodata_receive', {
		room: roomName,
		data: history
	});
	socket.on('geodata_send', function(data) {
		enemyHistory = data.data;
	});
	if (enemyHistory.length == 1) {
		paint_cell(enemyHistory[0].x, enemyHistory[0].y);
	} else {
		paintEnemy();
	}
	requestAnimationFrame(renderCanvas);
}

	var currentLocation = {
		x: null,
		y: null,
		speed: null,
		accuracy: null
	};

function success(position) {

	if (!(currentLat && currentLong)) {
		currentLong = Math.floor(Math.random() * 801);
		currentLat = Math.floor(Math.random() * 601);
		currentLocation.x = currentLong;
		currentLocation.y = currentLat;
	} else {
		currentLocation.x += (position.coords.x - currentLong) * 50;
		currentLocation.y += (position.coords.y - currentLat) * 50;
		currentLong = currentLocation.x;
		currentLat = currentLocation.y;
	}
	currentLocation.speed = position.coords.speed;
	currentLocation.accuracy = position.coords.accuracy;
	$('.currentLocation').html(currentLocation.x + ', ' + currentLocation.y);
	history.push(currentLocation);
	$('.speed').text(currentLocation.speed);
	$('.accuracy').text(currentLocation.accuracy);
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
		socket.emit('start_game', {

		});
		// if (data.requestArea) {
		// $('#gameModal').modal('show');
		// $('#startGame').on('click', function() {
		// roomLength = $('#room-length').val();
		// roomWidth = $('#room-width').val();
		// if (!(roomWidth.length > 0 && roomLength.length > 0)) {
		// return false;
		// }
		// socket.emit('start_game', {

		// });
		// $('#gameModal').modal('hide');
		// });
		// }
	});

	socket.on('game_started', function() {
		startGame();
	});
});