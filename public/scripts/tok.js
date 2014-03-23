var apiKey = "44704392";

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

var publisher, session, tok_session_id, tok_token;

$(document).ready(function(){
	console.log('emitting new_tok_sesh');
	socket.emit('new_tok_sesh', {room: roomName});
	socket.on('tok_sesh_generated', function(data){
		console.log('i got a session')
		publisher = TB.initPublisher(apiKey);
		tok_session_id = data.session_id;
		tok_token = data.token;
		session = TB.initSession(tok_session_id);
		session.connect(apiKey, tok_token);

		session.addEventListener("sessionConnected", sessionConnectedHandler);
		session.addEventListener("streamCreated", streamCreatedHandler);
	});
});

