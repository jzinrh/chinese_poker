define("js/views/play_area", [
	'js/app/client',
	'js/views/card',
	'template!templates/card.hbs'
], function(
	ClientApp,
	CardView,
	CardTemplate
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
			view.$el.empty();

			var lastPlay = _.last(ClientApp.get('stack'));

			if (lastPlay) {
				var cards = lastPlay.cards;
				_.each(cards, function(card) {
					var $card = CardTemplate({
						value: card.get('value'),
						suit: card.get('suit')
					});

					var viewID = card.get('value') + '-' + card.get('suit');
					// The largest hand to display is 5 cards.
					var cardWidth = ( view.$el.width() - 100 ) / 5;

					view.$el.append($card);

					var $cardViewEl = view.$el.find('#' + viewID);
					var cardView = new CardView({
						el: $cardViewEl,
						card: card,
						width: cardWidth
					});

					cardView.render();
				});
			}
			// TODO it's probably overkill to create a new card view when one already exists
		});

		return false;
	}

});

});
