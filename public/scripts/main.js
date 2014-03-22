window.ondevicemotion = function(event) {  
    var accelerationX = event.accelerationIncludingGravity.x;  
    var accelerationY = event.accelerationIncludingGravity.y;  
    var accelerationZ = event.accelerationIncludingGravity.z;  
    var string = 'accelerationX :' + accelerationX + '<br>' + 'accelerationY: ' + accelerationY + '<br>' + 'accelerationZ: ' + accelerationZ;
    $('.accel').text(string);
};