var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var _ = require('underscore');

// TODO: configure node require to include site/js
var requirejs = require('requirejs');
requirejs.config({
    baseUrl: __dirname + '/site/js'
});

var allGameSockets = {};
var games = {};
var cardApp = requirejs('app');

http.listen(8080, function(){
    console.log('listening on *:8080');
});

// Now it's a static file server!
app.use(
    express.static(__dirname + '/site')
);

// Landing page
app.get('/', function(req, res){
    res.sendfile('index.html');
});


io.on('connection', function(socket){
    console.log('a user connected ' + socket.id);

    socket.on('play cards', function(args) {
	playCardsHandler(socket, args);
    });

    socket.on('join', function(args) {
	joinGameHandler(socket, args);
    });

});

function playCardsHandler(socket, args) {
    console.log(args.name + ' played');
    var app = games[ args.game ];

    var gameSockets = allGameSockets[ args.game ];
    var nextPlayer = app.nextActivePlayer();

    _.each(gameSockets, function(gameSocket) {
	gameSocket.socket.emit('cards played', _.extend(args, {
	    activePlayer: nextPlayer.get('name')
	}));
    });
}

function joinGameHandler(socket, args) {
    console.log(args.name + ' ' + 'joined game ' + args.game);

    if (!allGameSockets[ args.game ]) {
	allGameSockets[ args.game ] = [];
	games[ args.game ] = new cardApp();
    }

    var gameSockets = allGameSockets[ args.game ];
    var game = games[ args.game ];

    var exists = _.find(gameSockets, function(gameSocket) {
	return gameSocket.name === args.name;
    });

    if (!exists) {
	gameSockets.push({
	    socket: socket,
	    name: args.name
	});

	var playerNames = _.map(['',' 2',' 3',' 4'], function(i) { return args.name + i; });

	console.log('player names: ' + playerNames);

	game.newGame({
	    playerNames: playerNames
	});

    }

    _.each(gameSockets, function(gameSocket) {
	console.log('name: ' + gameSocket.name);

	var player = game.getPlayer({
	    name: gameSocket.name
	});
	var activePlayer = game.activePlayer();
	console.log(activePlayer.get('name') + ' is the active player.');
	gameSocket.socket.emit('begin', {
	    player: player,
	    activePlayer: activePlayer.get('name')
	});
    });
}
