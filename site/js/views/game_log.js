define("js/views/game_log", [
	'js/models/card',
	'js/app/card',
	'js/app/client',
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

		ClientApp.on('logChange', function() {
			// TODO: make this a template
			// TODO: quit re-rendering the entire thing.
			view.$el.html('');
			var log = ClientApp.get('log');

			_.each(log, function(turn) {
				var cards = turn.cards;
				var passed = turn.pass;
				var playerName = turn.playerName;
				var displayString;

				if (passed) {
					displayString = '<div>' + playerName + ' passed their turn.</div>';
				}
				else if (turn.lastCard) {
					displayString = '<div>' + playerName + ' got the ' + turn.lastCard.toString() + '.</div>';
				}
				else {
					displayString = PlayedCardTemplate({
						player: playerName,
						contents: CardApp.handDisplayString(cards)
					});
				}

				view.$el.append(displayString);

				var elDom = view.$el.get(0);
				elDom.scrollTop = elDom.scrollHeight;
			});
		});

		return false;
	}

});

});
