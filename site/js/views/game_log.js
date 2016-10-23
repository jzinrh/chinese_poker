define("views/game_log", [
	'models/card',
	'app',
	'template!templates/played_card.hbs'
], function(
	Card,
	CardApp,
	PlayedCardTemplate
) {

return Backbone.View.extend({

	initialize: function(args) {
		var view = this;

		view.app = {};
		view.app[ 'card' ] = new CardApp();

		view.socket = args.socket;
	},

	render: function() {
		var view = this;
		debugger;
		view.attachListeners();
	},

	attachListeners: function() {
		var view = this;

		if (view.attachedListeners) {
			return false;
		}

		view.attachedListeners = true;

		view.socket.on('cards played', function(args) {
			debugger;
			var cards = _.map(args.cards, function(cardContext) {
				return new Card(cardContext);
			});

			var handDisplayString = view.app[ 'card' ].handDisplayString(cards);
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
