define("js/models/deck", [
	'js/models/card',
	'js/collections/card',
	'underscore'
], function(
	Card,
	CardCollection,
	_
) {

return CardCollection.extend({

	initialize: function() {
		var deck = this;

		var suits = [ 'Diamonds', 'Clubs', 'Hearts', 'Spades' ];
		var values = _.range(1,14);

		var allCards = _.flatten(
			_.map(suits, function(cardSuit) {
				return _.map(values, function(cardValue) {
					return new Card({
						suit: cardSuit,
						value: cardValue
					});
				});
			})
		);

		allCards = _.shuffle(allCards);

		deck.add(allCards);

		return;
	}
});

});
