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

var io = require('socket.io').listen(app.get('port'));
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

io.sockets.on('connection', function(socket) {
	socket.on('geodata_receive', geodata.receive);
});

io.set('loglevel', 10);
io.sockets.on('connection', function(socket) {
	socket.on('update', function(data) {});
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});