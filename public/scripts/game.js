var accel = {
	x: null,
	y: null,
	z: null
};
var history = [];
var roomName = window.location.href.substring(window.location.href.lastIndexOf('/'));

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

$(document).ready(function() {
	var canvas = $('canvas'),
		ctx = canvas[0].getContext("2d"),
		width = canvas.width(),
		height = canvas.height();

	if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
		socket = io.connect(window.location.href);
		socket.emit('enter_room', {
			room:
		});
		window.addEventListener('devicemotion', handleDeviceMotion, false);

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
	}
});