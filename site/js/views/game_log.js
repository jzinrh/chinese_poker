define("views/game_log", [
	'models/card',
	'app/card',
	'template!templates/played_card.hbs'
], function(
	Card,
	CardApp,
	PlayedCardTemplate
) {

return Backbone.View.extend({

	initialize: function(args) {
		var view = this;

		view.socket = args.socket;
	},

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

		view.socket.on('cards played', function(args) {

			var cards = _.map(args.cards, function(cardContext) {
				return new Card(cardContext);
			});

			var handDisplayString = CardApp.handDisplayString(cards);
			view.$el.append(
				PlayedCardTemplate({
					player: args.name,
					contents: handDisplayString
				})
			);
		});

		return false;
	}

});

});
