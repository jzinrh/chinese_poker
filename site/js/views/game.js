define("js/views/game", [
	'js/app/client',
	'js/views/registration',
	'js/views/player',
	'js/views/game_log',
	'js/models/player',
	'js/collections/card',
	'js/models/card',
	'template!templates/player.hbs'
], function(
	ClientApp,
	RegistrationView,
	PlayerView,
	GameLogView,
	Player,
	CardCollection,
	Card,
	PlayerTemplate
) {

return Backbone.View.extend({

	render: function() {
		var view = this;

		var $registration = view.$el.find('.registration');
		var $gameLog = view.$el.find('.game-log');

		view.registrationView = new RegistrationView({
			el: $registration
		});

		view.gameLogView = new GameLogView({
			el: $gameLog
		});

		view.registrationView.render();
		view.gameLogView.render();

		view.attachListeners();
	},

	attachListeners: function() {
		var view = this;

		// TODO: when the player is SET, not necessarily changed
		ClientApp.on('change:player', function() {
			// TODO: this should already be rendered, and listening on the change of player in the player view.
			var $player = view.$el.find('.player');

			view.playerView = new PlayerView({
				el: $player
			});

			view.playerView.render();
		});

		// The following is just for the players/whose turn it is
		ClientApp.on('change:playerNames', function() {
			var playerNames = ClientApp.get('playerNames');
			var activePlayer = ClientApp.get('activePlayer');
			var $allPlayers = view.$el.find('.all-players');

			_.each(playerNames, function(playerName) {
				var isActivePlayer = ( playerName === activePlayer );
				$allPlayers.append(PlayerTemplate({
					name: playerName,
					activePlayer: isActivePlayer
				}));
			});
		});

		ClientApp.on('change:activePlayer', function() {
			var activePlayer = ClientApp.get('activePlayer');
			var $players = view.$el.find('.all-players .player');

			$players.each(function(index) {
				var $player = $(this);
				var playerName = $player.data('name');
				$player.toggleClass('active-player', playerName === activePlayer);
			});
		});
	}

});

});