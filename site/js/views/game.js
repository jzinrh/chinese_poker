define("views/game", [
	'views/registration',
	'views/player',
	'views/game_log',
	'models/player',
	'collections/card',
	'models/card',
	'socketio'
], function(
	RegistrationView,
	PlayerView,
	GameLogView,
	Player,
	CardCollection,
	Card,
	io
) {

return Backbone.View.extend({

	initialize: function() {
		var view = this;

		var url = 'http://localhost:8080';
		view.socket = io.connect(url);

	},

	render: function() {
		var view = this;

		var $registration = view.$el.find('.registration');
		var $gameLog = view.$el.find('.game-log');

		view.registrationView = new RegistrationView({
			el: $registration,
			socket: view.socket
		});

		view.gameLogView = new GameLogView({
			el: $gameLog,
			socket: view.socket
		});

		view.registrationView.render();
		view.gameLogView.render();

		view.attachListeners();
	},

	attachListeners: function() {
		var view = this;

		var $player = view.$el.find('.player');

		// When the game begins, switch to the in-game player view.
		view.socket.on('begin', function(args) {
			var player = args.player;

			var cards = _.map(player.hand, function(card) {
				return new Card(card);
			});

			var playerHand = new CardCollection(cards);

			view.player = new Player({
				name: player.name,
				hand: playerHand
			});

			view.cards = view.player.get('hand');

			view.playerView = new PlayerView({
				el: $player,
				socket: view.socket,
				player: view.player,
				gameCode: args.gameCode,
				cards: view.cards
			});

			view.playerView.render();

		});

	}

});

});