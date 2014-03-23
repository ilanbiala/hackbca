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

function check_collision(user, enemy) {
	for (var i = 1; i< enemyHistory.length; i++){
		if (enemyHistory[i].x-currentLocation.x<5 && enemyHistory[i].y-currentLocation.y<5){
			alert('You lost. :( Go back to the homepage to play again.');
			socket.emit('lose', {

			});	
		}
	}
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
	var currentLoc = currentLocation;
	if (!(currentLat && currentLong)) {
		currentLong = position.coords.longitude;
		currentLat = position.coords.latitude;
		currentLoc.x = Math.floor(Math.random() * 801);
		currentLoc.y = Math.floor(Math.random() * 601);
	} else {
		currentLoc.x += (position.coords.longitude - currentLong) * 1500000;
		currentLoc.y += (position.coords.latitude - currentLat) * 1500000;
		currentLong = position.coords.longitude;
		currentLat = position.coords.latitude;
	}
	if (currentLoc.x > 800 || currentLoc.x < 0 || currentLoc.y > 600 || currentLoc.y < 0) {
		alert('You lost. :( Go back to the homepage to play again.');
		socket.emit('lose', {

		});
	}
	currentLoc.speed = position.coords.speed;
	currentLoc.accuracy = position.coords.accuracy;
	$('.currentLocation').html(currentLoc.x + ', ' + currentLoc.y);
	history.push(currentLoc);
	$('.speed').text(currentLoc.speed);
	$('.accuracy').text(currentLoc.accuracy);
	$('.history').text(history.length);
	// currentLocation = currentLoc;
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

	socket.on('win', function() {
		alert('You win! :) Go back to the homepage to play again.');
	});
});
