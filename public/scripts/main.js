var socket;
var accel = {
	x: null,
	y: null,
	z: null
};

$(document).ready(function() {
	if (!(window.DeviceOrientationEvent && window.DeviceMotionEvent)) {

	} else {
		socket = io.connect('http://localhost');
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
		}
	}
});