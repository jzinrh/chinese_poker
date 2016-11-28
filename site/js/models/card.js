define("js/models/card", [
	'backbone'
], function(
	Backbone
) {

return Backbone.Model.extend({

	valueLookup: {
		1: 'Ace',
		11: 'Jack',
		12: 'Queen',
		13: 'King'
	},

	suitLookup: {
		'Diamonds': 1,
		'Clubs': 2,
		'Hearts': 3,
		'Spades': 4
	},

	compareValue: function() {
		var card = this;

		var value = card.get('value');

		// TODO fix this hack
		var lookup = {
			1: 14,
			2: 15
		};

		if (lookup[ value ]) {
			value = lookup[value];
		}

		return value;
	},

	suitValue: function() {
		var card = this;

		return card.suitLookup[ card.get('suit') ];
	},

	displayValue: function() {
		var card = this;

		var value = card.get('value');
		if (card.valueLookup[ value ]) {
			value = card.valueLookup[ value ];
		}

		return value;
	},

	toString: function() {
		var card = this;

		return card.displayValue() + ' of ' + card.get('suit');
	},

	toShortString: function() {
		var card = this;

		var displayValue = card.displayValue();
		var suit = card.get('suit');
		return String(displayValue)[0] + suit[0];
	}
});


});
