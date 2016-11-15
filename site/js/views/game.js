define("js/views/game", [
	'js/app/client',
	'js/views/player_status',
	'js/views/registration',
	'js/views/player',
	'js/views/game_log',
	'js/models/player',
	'js/collections/card',
	'js/models/card'
], function(
	ClientApp,
	PlayerStatusView,
	RegistrationView,
	PlayerView,
	GameLogView,
	Player,
	CardCollection,
	Card
) {

return Backbone.View.extend({

	render: function() {
		var view = this;

		var $playerStatus = view.$el.find('.player-status');
		var $registration = view.$el.find('.registration');
		var $gameLog = view.$el.find('.game-log');
		var $player = view.$el.find('.player');

		view.playerStatusView = new PlayerStatusView({
			el: $playerStatus
		});

		view.registrationView = new RegistrationView({
			el: $registration
		});

		view.gameLogView = new GameLogView({
			el: $gameLog
		});

		view.playerView = new PlayerView({
			el: $player
		});

		view.playerStatusView.render();
		view.registrationView.render();
		view.gameLogView.render();
		view.playerView.render();
	}
});

});