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

	displayValue: function() {
		var card = this;

		var value = card.get('value');
		if (card.valueLookup[ value ]) {
			value = card.valueLookup[ value ];
		}

		return value;
	}

});


});
