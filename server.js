var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

// TODO: configure node require to include site/js
var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname + '/site',
	nodeRequire: require
});

var allGameSockets = {};
var games = {};
var gameApp = requirejs('js/app/game');

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
		// TODO add same validation
		playCardsHandler(socket, args);
	});

	socket.on('pass turn', function(args) {
		console.log(args.name + ' passed.');

		var gameSockets = allGameSockets[ args.game ];
		var gameApp = games[ args.game ];
		var nextPlayer = gameApp.nextActivePlayer();
		var activePlayerName = nextPlayer.get('name');
		_.each(gameSockets, function(gameSocket) {
			gameSocket.socket.emit('passed turn', args.name);
			gameSocket.socket.emit('active player', activePlayerName);
			console.log(activePlayerName + ' is the active player');
		});

	});

	socket.on('join', function(args) {
		joinGameHandler(socket, args);
	});

});

function playCardsHandler(socket, args) {
	console.log(args.name + ' played');
	var gameApp = games[ args.game ];

	var gameSockets = allGameSockets[ args.game ];
	var nextPlayer = gameApp.nextActivePlayer();

	_.each(gameSockets, function(gameSocket) {
		gameSocket.socket.emit('cards played', args);
		gameSocket.socket.emit('active player', nextPlayer.get('name'));
	});
}

function joinGameHandler(socket, args) {
	console.log(args.name + ' ' + 'joined game ' + args.game);

	if (!allGameSockets[ args.game ]) {
		allGameSockets[ args.game ] = [];
		games[ args.game ] = new gameApp();
	}

	var gameSockets = allGameSockets[ args.game ];
	var game = games[ args.game ];

	var exists = _.find(gameSockets, function(gameSocket) {
		return gameSocket.name === args.name;
	});

	var playerNames = [];
	if (!exists) {
		gameSockets.push({
			socket: socket,
			name: args.name
		});
	}

	// Change to 1 for basic testing
	if (0) {
		playerNames = _.map(['',' 2',' 3',' 4'], function(i) { return args.name + i; });
	}
	else {
		playerNames = _.map(gameSockets, function(gameSocket) {
			return gameSocket['name'];
		});
	}

	_.map(gameSockets, function(gameSocket) {
		return gameSocket.socket.emit('players', playerNames);
	});


	if (playerNames.length == 4 && !game.gameIsStarted()) {
		console.log('player names: ' + playerNames);

		_startGame({
			game: game,
			gameCode: args.game,
			gameSockets: gameSockets,
			playerNames: playerNames
		});
	}
	// player is rejoining game
	else if (game.gameIsStarted()) {
		var player = game.getPlayer({
			name: args.name
		});

		var activePlayerName = game.activePlayer().get('name');
		console.log(args.name + ' is rejoining.');

		socket.emit('players', playerNames);
		socket.emit('begin', {
			player: player,
			gameCode: args.gameCode,
			activePlayer: activePlayerName
		});
		socket.emit('active player', activePlayerName);
	}
}

// _ signifies private function, not necessarily enforced
function _startGame(args) {
	var game = args.game;
	var gameSockets = args.gameSockets;
	var playerNames = args.playerNames;
	var gameCode = args.gameCode;

	game.newGame({
		playerNames: playerNames
	});

	var activePlayer = game.activePlayer();
	console.log('********************************************************************************');
	console.log('Game started');

	_.each(gameSockets, function(gameSocket) {
		var playerString = gameSocket.name;
		if (gameSocket.name === activePlayer.get('name')) {
			playerString += ' * Active Player *';
		}
		console.log(playerString);

		var player = game.getPlayer({
			name: gameSocket.name
		});

		gameSocket.socket.emit('begin', {
			player: player,
			gameCode: gameCode,
			activePlayer: activePlayer.get('name')
		});
	});
	console.log('********************************************************************************');

}
