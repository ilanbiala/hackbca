$(document).ready(function() {
	if (!(window.DeviceOrientationEvent && window.DeviceMotionEvent)) {

	} else {
		window.addEventListener('devicemotion', deviceMotionHandler, false);

		function deviceMotionHandler(eventData) {
			var info, xyz = "[X, Y, Z]";

			// Grab the acceleration from the results
			var acceleration = eventData.acceleration;
			info = xyz.replace("X", acceleration.x);
			info = info.replace("Y", acceleration.y);
			info = info.replace("Z", acceleration.z);
			$('.accel').text(info);

			// Grab the acceleration including gravity from the results
			acceleration = eventData.accelerationIncludingGravity;
			info = xyz.replace("X", acceleration.x);
			info = info.replace("Y", acceleration.y);
			info = info.replace("Z", acceleration.z);
			$('.accelGrav').text(info);

			// Grab the rotation rate from the results
			var rotation = eventData.rotationRate;
			info = xyz.replace("X", rotation.alpha);
			info = info.replace("Y", rotation.beta);
			info = info.replace("Z", rotation.gamma);
			$('.accelRotate').text(info);

			// // Grab the refresh interval from the results
			info = eventData.interval;
			$('.accel').text(info);
		}
	}
});