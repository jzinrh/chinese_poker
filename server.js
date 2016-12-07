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
app.get('/', function(req, res) {
	res.sendfile('index.html');
});


io.on('connection', function(socket) {

	socket.on('create', function(args) {
		var newGameCode = _generateGameCode();

		while (allGameSockets[ newGameCode ]) {
			newGameCode = _generateGameCode();
		}

		allGameSockets[ newGameCode ] = [];
		games[ newGameCode ] = new gameApp();

		_joinGame(socket, {
			game: newGameCode,
			name: args.name
		});

		socket.emit('created game', newGameCode);
	});

	socket.on('start', function(args) {
		var gameSockets = allGameSockets[ args.game ];
		var game = games[ args.game ];
		var playerNames = _playerNames(args.game);

		if (_.contains([3,4], playerNames.length) && !game.gameIsStarted()) {
			console.log('player names: ' + playerNames);

			_startGame({
				game: game,
				gameCode: args.game,
				gameSockets: gameSockets,
				playerNames: playerNames
			});
		}
	});

	console.log('a user connected ' + socket.id);

	socket.on('disconnect', function() {
		_.each(allGameSockets, function(gameSockets, gameCode) {

			// definitely a cleaner way to do this
			var socketInfo = _.find(gameSockets, function(socketInfo) {
				return ( socketInfo.socket.id == socket.id );
			});

			if (socketInfo) {
				console.log(socketInfo.name + ' has disconnected.');
				allGameSockets[ gameCode ] = _.filter(gameSockets, function(socketInfo) {
					return ( socketInfo.socket.id != socket.id );
				});
			}

			if (!allGameSockets[ gameCode ].length) {
				console.log('Last user for ' + gameCode + ' disconnected, killing the game');
				delete allGameSockets[ gameCode ];
				delete games[ gameCode ];
			}
		});
	});

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
	var gameApp = games[ args.game ];

	var activePlayer = gameApp.activePlayer();
	var playedCards = args.cards;
	var playedCardModels = activePlayer.get('hand').filter(function(card) {
		return _.any(playedCards, function(playedCard) {
			return (
				playedCard.suit === card.get('suit')
				&& playedCard.value === card.get('value')
			);
		});
	});

	activePlayer.get('hand').remove(playedCardModels);

	var gameSockets = allGameSockets[ args.game ];
	var nextPlayer = gameApp.nextActivePlayer();

	console.log(args.name + ' played and has ' + activePlayer.get('hand').length + ' cards left');
	console.log(nextPlayer.get('name') + ' is the active player');

	_.each(gameSockets, function(gameSocket) {
		gameSocket.socket.emit('cards played', args);
		gameSocket.socket.emit('active player', nextPlayer.get('name'));
	});
}

function joinGameHandler(socket, args) {
	var game = games[ args.game ];

	if (!game) {
		socket.emit('join error', args.game);
		return;
	}

	console.log(args.name + ' ' + 'joined game ' + args.game);

	_joinGame(socket, args);
}

function _joinGame(socket, args) {
	var game = games[ args.game ];

	var gameSockets = allGameSockets[ args.game ];
	var exists = _.find(gameSockets, function(gameSocket) {
		return gameSocket.name === args.name;
	});

	if (!exists) {
		gameSockets.push({
			socket: socket,
			name: args.name
		});
	}

	var playerNames = _playerNames(args.game);

	_.each(gameSockets, function(gameSocket) {
		gameSocket.socket.emit('players', playerNames);
	});

	if (game.gameIsStarted() && !exists) {
		var player = game.getPlayer({
			name: args.name
		});

		var activePlayerName = game.activePlayer().get('name');
		console.log(args.name + ' is rejoining.');

		socket.emit('players', playerNames);
		socket.emit('started', {
			player: player,
			activePlayer: activePlayerName
		});
		socket.emit('active player', activePlayerName);
	}
}

function _startGame(args) {
	var game = args.game;
	var gameSockets = args.gameSockets;
	var playerNames = args.playerNames;
	var gameCode = args.gameCode;

	game.newGame({
		playerNames: playerNames
	});

	var activePlayer = game.activePlayer();
	var lastCard = game.lastCard();
	console.log(activePlayer.get('name') + ' got the last card ' + lastCard.toString());

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

		gameSocket.socket.emit('started', {
			player: player,
			gameCode: gameCode,
			activePlayer: activePlayer.get('name'),
			lastCard: lastCard
		});
	});
	console.log('********************************************************************************');

}

function _generateGameCode() {
	return Math.random().toString(36).substr(2, 5);
}

function _playerNames(gameCode) {
	var gameSockets = allGameSockets[ gameCode ];

	var playerNames = playerNames = _.map(gameSockets, function(gameSocket) {
		return gameSocket['name'];
	});

	// Change to 1 for basic testing
	if (0) {
		var numberOfBotsToAdd = 4 - playerNames.length;
		_.each(_.range(0, numberOfBotsToAdd), function(i) {
			playerNames.push('bot ' + i);
		});
	}

	return playerNames;
}