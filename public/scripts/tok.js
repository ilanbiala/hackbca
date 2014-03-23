var apiKey = "44704392";
var sessionId = "1_MX40NDcwNDM5Mn5-U2F0IE1hciAyMiAxNzozNzoxNCBQRFQgMjAxNH4wLjkwNjI4MjJ-";
var token = "T1==cGFydG5lcl9pZD00NDcwNDM5MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz00MzRiNjcwZjcxNjJhOTk1ZjJiYjBkOTJkODAwZGQ4Yjg0OGUwMDgxOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRjd05ETTVNbjUtVTJGMElFMWhjaUF5TWlBeE56b3pOem94TkNCUVJGUWdNakF4Tkg0d0xqa3dOakk0TWpKLSZjcmVhdGVfdGltZT0xMzk1NTM1MDM2Jm5vbmNlPTAuMTE2MTQ1ODQyNjk1Nzk1MDkmZXhwaXJlX3RpbWU9MTM5NTYyMTQzNCZjb25uZWN0aW9uX2RhdGE9";

// Initialize session, set up event listeners, and connect
function sessionConnectedHandler(event) {
	session.publish(publisher);
	subscribeToStreams(event.streams);
}

function subscribeToStreams(streams) {
	for (var i = 0; i < streams.length; i++) {
		var stream = streams[i];
		if (stream.connection.connectionId != session.connection.connectionId) {
			session.subscribe(stream);
		}
	}
}

function streamCreatedHandler(event) {
	subscribeToStreams(event.streams);
}

var publisher = TB.initPublisher(apiKey, 'video');
var session = TB.initSession(sessionId);

session.connect(apiKey, token);
session.addEventListener("sessionConnected", sessionConnectedHandler);


session.addEventListener("streamCreated", streamCreatedHandler);
