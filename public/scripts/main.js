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
			accel.x = acceleration.x;
			accel.y = acceleration.y;
			accel.z = acceleration.z;

			var accelString = '';
			accelString += accel.x + '<br>';
			accelString += accel.y + '<br>';
			accelString += accel.z + '<br>';
			$('.accel').html(accelString);
			socket.emit('geodata_receive', {
				data: accel
			});
		}
	}
});