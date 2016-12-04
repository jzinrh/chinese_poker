define("js/app/client", [
	'backbone',
	'socketio',
	'js/models/card',
	'js/models/player',
	'js/collections/card'
], function(
	Backbone,
	io,
	Card,
	Player,
	CardCollection
) {

// This is a singleton that handles all of the incoming socket messages from the server
// Goal is to consolidate the shared data between the views, and have a single server/client relationship for messages.
var clientApp = Backbone.Model.extend({
	socket: io.connect(),

	// This probably shouldn't be in the socket app, and instead in the game or utils app?
	selectedCards: function() {
		var app = this;

		var cards = app.get('cards');

		var selectedCards = cards.filter(function(card) {
			return card.get('selected');
		});

		return selectedCards;
	},

	createGame: function(args) {
		var app = this;

		app.socket.emit('create', args);
	},

	joinGame: function(args) {
		var app = this;

		app.socket.emit('join', args);
	},

	startGame: function(args) {
		var app = this;

		app.socket.emit('start', args);
	},

	playCards: function() {
		var app = this;

		var gameCode = app.get('gameCode');
		var player = app.get('player');
		var selectedCards = app.selectedCards();

		app.get('cards').remove(selectedCards);

		app.socket.emit('play cards', {
			game: gameCode,
			name: player.get('name'),
			cards: selectedCards
		});

	},

	passTurn: function() {
		var app = this;

		var gameCode = app.get('gameCode');
		var player = app.get('player');

		app.socket.emit('pass turn', {
			game: gameCode,
			name: player.get('name')
		});
	},

	// This is just for testing and shouldn't actually be part of game play.
	_passActiveTurn: function() {
		var app = this;

		var gameCode = app.get('gameCode');

		app.socket.emit('pass turn', {
			game: gameCode,
			name: app.get('activePlayer')
		});
	}

});

var ClientApp = new clientApp();

ClientApp.socket.on('players', function(playerNames) {
	ClientApp.set('playerNames', playerNames);
});

ClientApp.socket.on('started', function(args) {
	var player = args.player;

	ClientApp.set('log', []);
	ClientApp.set('stack', []);

	var cards = _.map(player.hand, function(card) {
		return new Card(card);
	});

	var playerHand = new CardCollection(cards);

	var playerModel = new Player({
		name: player.name,
		hand: playerHand
	});

	ClientApp.set({
		player: playerModel,
		activePlayer: args.activePlayer,
		isActivePlayer: ( args.activePlayer === playerModel.get('name') ),
		gameCode: args.gameCode,
		cards: playerModel.get('hand')
	});
});

ClientApp.socket.on('cards played', function(args) {
	var stack = ClientApp.get('stack');
	var log = ClientApp.get('log');

	var cards = _.map(args.cards, function(cardContext) {
		return new Card(cardContext);
	});

	var play = {
		cards: cards,
		playerName: args.name
	};

	// Add this to two collections, as the stack only holds non-passing plays
	stack.push(play);
	log.push(play);

	ClientApp.trigger('stackChange');
	ClientApp.trigger('logChange');
});

ClientApp.socket.on('passed turn', function(playerName) {
	var log = ClientApp.get('log');

	log.push({
		pass: true,
		playerName: playerName
	});

	ClientApp.trigger('logChange');
});

ClientApp.socket.on('active player', function(activePlayer) {
	var player = ClientApp.get('player');
	var stack = ClientApp.get('stack');
	var lastPlay = _.last(stack);

	// Wipe out the stack if the active player made the last play.
	if (lastPlay && lastPlay.playerName === activePlayer) {
		ClientApp.set('stack', []);
		ClientApp.trigger('stackChange');
	}

	ClientApp.set({
		activePlayer: activePlayer,
		isActivePlayer: ( activePlayer === player.get('name') )
	});
});

ClientApp.socket.on('created game', function(newGameCode) {
	ClientApp.set('gameCode', newGameCode);
});

return ClientApp;

});
