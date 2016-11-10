define("views/game_log", [
	'models/card',
	'app/card',
	'app/client',
	'template!templates/played_card.hbs'
], function(
	Card,
	CardApp,
	ClientApp,
	PlayedCardTemplate
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

		ClientApp.on('stackChange', function() {
			// TODO: make this a template
			view.$el.html('');
			var stack = ClientApp.get('stack');

			_.each(stack, function(play) {
				var cards = play.cards;
				var passed = play.pass;
				var playerName = play.playerName;
				var displayString;

				if (passed) {
					displayString = '<div>' + playerName + ' passed their turn.</div>';
				}
				else {
					displayString = PlayedCardTemplate({
						player: playerName,
						contents: CardApp.handDisplayString(cards)
					});
				}

				view.$el.append(displayString);
			});
		});

		return false;
	}

});

});
