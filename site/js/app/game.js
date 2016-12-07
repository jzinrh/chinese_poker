define("js/app/game", [
	'backbone',
	'underscore',
	'js/models/game'
], function(
	Backbone,
	_,
	Game
) {

return Backbone.Model.extend({

	newGame: function(args) {
		var app = this;

		app.game = new Game();

		app.game.set('started', true);
		app.game.set('playerNames', args.playerNames);
		app.game.deal();
	},

	getPlayer: function(args) {
		var app = this;

		var playerName = args.name;

		var player = _.find(app.game.get('players'), function(player) {
			return playerName === player.get('name');
		});

		return player;
	},

	nextActivePlayer: function(args) {
		var app = this;

		var activePlayer = app.activePlayer();
		var players = app.game.get('players');

		var activePlayers = _.filter(players, function(player) {
			return (
				player.get('hand').length > 0
				|| player.cid === activePlayer.cid
			);
		});

		var activePlayerIndex = _.findIndex(activePlayers, function(player) {
			return activePlayer.cid === player.cid;
		});

		var nextPlayerIndex = ( activePlayerIndex + 1 ) % activePlayers.length;
		var nextPlayer = activePlayers[ nextPlayerIndex ];

		return app.activePlayer({ activePlayer: nextPlayer });
	},

	activePlayer: function(args) {
		var app = this;

		if (args && args.activePlayer) {
			app.game.set('activePlayer', args.activePlayer);
		}

		return app.game.get('activePlayer');
	},

	gameIsStarted: function() {
		var app = this;

		return (app.game && app.game.get('started'));
	},

	lastCard: function() {
		var app = this;

		return app.game.get('lastCard');
	}

});

});
