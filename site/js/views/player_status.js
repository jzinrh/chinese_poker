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

		view.attachListeners();
	},

	attachListeners: function() {
		var view = this;

		if (view.attachedListeners) {
			return false;
		}

		view.attachedListeners = true;

		ClientApp.on('change:playerNames', function() {
			var playerNames = ClientApp.get('playerNames');
			var activePlayer = ClientApp.get('activePlayer');
			view.$el.html('');
			_.each(playerNames, function(playerName) {
				var isActivePlayer = ( playerName === activePlayer );
				view.$el.append(PlayerTemplate({
					name: playerName,
					activePlayer: isActivePlayer
				}));
			});

		});

		ClientApp.on('change:activePlayer', function() {
			var activePlayer = ClientApp.get('activePlayer');
			var $players = view.$el.find('.player');

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
