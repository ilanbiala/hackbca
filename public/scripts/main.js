$(document).ready(function() {
	if (!(window.DeviceOrientationEvent && window.DeviceMotionEvent)) {

	} else {
		window.addEventListener('devicemotion', deviceMotionHandler, false);

		function deviceMotionHandler(eventData) {
			var accel = {
				x: null,
				y: null,
				z: null
			};

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
		}
	}
});