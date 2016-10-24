define("app/card", [
	'backbone',
	'underscore'
], function(
	Backbone,
	_
) {

var cardApp = Backbone.Model.extend({

	isValidHand: function(cards) {
		var app = this;

		var isValid = false;
		if (cards.length == 1) {
			isValid = true;
		}
		else if (cards.length == 2 || cards.length == 3) {
			var uniqueCards = _.uniq(cards, function(card) {
				return card.get('value');
			});
			isValid = (uniqueCards.length == 1);
		}

		return isValid;
	},

	handDisplayString: function(cards) {
		var app = this;

		var selectedHand;
		if (cards.length == 1) {
			selectedHand = cards[0].displayValue() + ' of ' + cards[0].get('suit');
		}
		else if (cards.length == 2 || cards.length == 3) {
			if (cards.length == 2) {
				selectedHand = 'Pair of ';
			}
			else {
				selectedHand = 'Triple ';
			}
			selectedHand += cards[0].displayValue() + 's';
		}

		return selectedHand;
	}

});

return new cardApp();

});
