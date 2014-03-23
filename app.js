/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');

var app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.render('index', {
		title: 'Snake',
		error: null
	});
});

app.get('/room/:room', function(req, res) {
	console.log(io.sockets.clients(req.params.room).length);
	if (io.sockets.clients(req.params.room).length >= 2) {
		res.redirect('/error/full_room');
	}
	res.render('room/index', {
		title: 'Snake'
	});
});

app.get('/error/:error', function(req, res) {
	var msgs = {
		'full_room': 'That room is full!'
	};
	res.render('index', {
		title: 'Snake',
		error: msgs[req.params.error]
	});
});

io.set('loglevel', 3);

io.configure(function() {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
	socket.on('geodata_receive', function(data) {
		var geodata = {};
		console.log(data);
	});
	socket.on('join_room', function(data) {
		console.log(io.sockets.clients(data.room).length);
		if (data.room in io.sockets.manager.rooms) {
			socket.set('room', data.room);
			socket.emit('room_joined', {
				room: data.room
			});
		} else if (io.sockets.clients(data.room).length < 2) {
			socket.set('room', data.room);
			socket.emit('room_joined', {
				room: data.room
			});
		} else {
			socket.emit('error', {
				msg: 'room full'
			});
		}
	});
	socket.on('enter_room', function(data) {
		socket.join(data.room);
		if (io.sockets.clients(data.room).length === 1) {
			socket.emit('room_entered', {
				requestArea: true
			});
		} else {
			socket.emit('room_entered', {
				requestArea: false
			});
		}
	});
	socket.on('start_game', function(data) {
		io.sockets.in(socket.get('room')).emit('game_started');
	})
	socket.on('disconnect', function() {
		socket.leave(socket.get('room'));
	});
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});