define("js/views/player_status", [
	'js/app/client',
	'template!templates/player.hbs'
], function(
	ClientApp,
	PlayerTemplate
) {

return Backbone.View.extend({

	render: function() {
		var view = this;

		var playerNames = ClientApp.get('playerNames');
		var gameCode = ClientApp.get('gameCode');
		var activePlayer = ClientApp.get('activePlayer');
		view.$el.html('');

		if (gameCode) {
			view.$el.append('Game Code: ' + gameCode);
		}
		_.each(playerNames, function(playerName) {
			var isActivePlayer = ( playerName === activePlayer );
			view.$el.append(PlayerTemplate({
				name: playerName,
				activePlayer: isActivePlayer
			}));
		});

		view.attachListeners();
	},

	attachListeners: function() {
		var view = this;

		if (view.attachedListeners) {
			return false;
		}

		view.attachedListeners = true;

		ClientApp.on('change:gameCode', function() {
			view.render();
		});

		ClientApp.on('change:playerNames', function() {
			view.render();
		});

		ClientApp.on('change:activePlayer', function() {
			var activePlayer = ClientApp.get('activePlayer');
			var $players = view.$el.find('.player-item');

			$players.each(function(index) {
				var $player = $(this);
				var playerName = $player.data('name');
				$player.toggleClass('active-player', playerName === activePlayer);
			});
		});

		return false;
	}

});

});
