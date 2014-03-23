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

var geodata = require('./geodata');

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
		title: 'Snake'
	});
});

// app.get('/room/:room', function(req, res) {
// 	var room = req.params.room;
// 	if (rooms.indexOf(room) != -1) {

// 	}
// });

io.set('loglevel', 10);

var rooms = [];

io.sockets.on('connection', function(socket) {
	socket.on('geodata_receive', function(data) {
		var geodata = {};
		console.log(data);
	});
	socket.on('join_room', function(data) {
		if (rooms.indexOf(data.room) === -1) {
			rooms.push(data.room);
			socket.join(data.room);
			socket.set('nick', data.nick);
			socket.emit('room_joined', {
				room: data.room
			});
			res.redirect('/room/' + data.room);
		} else if (sockets.clients(data.room) < 2) {
			socket.join(data.room);
			socket.set('nick', data.nick);
			socket.emit('room_joined', {
				room: data.room
			});
			res.redirect('/room/' + data.room);
		} else {
			socket.emit('error', {
				msg: 'room full'
			});
		}
	});
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});