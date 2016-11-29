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
		Game.set('started', true);
		Game.set('playerNames', args.playerNames);
		Game.deal();
	},

	//expects args as a hash with 'name' as the key
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
		var activePlayerIndex = _.findIndex(players, function(player) {
			return activePlayer.cid === player.cid;
		});

		var nextPlayerIndex = ( activePlayerIndex + 1 ) % players.length;
		var nextPlayer = players[ nextPlayerIndex ];

		return app.activePlayer({ activePlayer: nextPlayer });
	},

	// args is object with 'activePlayer' as the key
	activePlayer: function(args) {
		var app = this;

		if (args && args.activePlayer) {
			Game.set('activePlayer', args.activePlayer);
		}

		return Game.get('activePlayer');
	},

	gameIsStarted: function() {
		return Game.get('started');
	}

});

});
