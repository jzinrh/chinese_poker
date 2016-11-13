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
		app.game = Game;
		Game.set('playerNames', args.playerNames);
		Game.deal();
	},

	getPlayer: function(args) {
		var app = this;

		var playerName = args.name;

		var player = _.find(Game.get('players'), function(player) {
			return playerName === player.get('name');
		});

		return player;
	},

	nextActivePlayer: function(args) {
		var app = this;

		var activePlayer = app.activePlayer();
		var players = Game.get('players');
		var playerIndex = _.findIndex(players, function(player) {
			return activePlayer.cid === player.cid;
		});

		var nextPlayerIndex = ( playerIndex + 1 ) % players.length;
		var nextPlayer = players[ nextPlayerIndex ];

		return app.activePlayer({ activePlayer: nextPlayer });
	},

	activePlayer: function(args) {
		var app = this;

		if (args && args.activePlayer) {
			Game.set('activePlayer', args.activePlayer);
		}

		return Game.get('activePlayer');
	}

});

});
