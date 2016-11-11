define("models/card", [
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
		1: 'Diamonds',
		2: 'Clubs',
		3: 'Hearts',
		4: 'Spades'
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

		debugger;
		var displayValue = card.displayValue();
		var suit = card.get('suit');
		return String(displayValue)[0] + suit[0];
	}

});


});
