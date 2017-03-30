var http = require('http')
var express = require('express')

var gameport = 8000;

var app = express();
var server = http.Server(app);

server.listen(gameport);

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/breakout2d.html');
});