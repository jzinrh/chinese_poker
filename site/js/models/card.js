define("models/card", [
    'backbone'
], function(
    Backbone
) {

return Backbone.Model.extend({

    displayValue: function() {
	var card = this;

	var value = card.get('value');
	if (card.valueLookup[ value ]) {
	    value = card.valueLookup[ value ];
	}

	return value;
    },

    valueLookup: {
	1: 'Ace',
	11: 'Jack',
	12: 'Queen',
	13: 'King'
    },

    to_string: function() {
	var model = this;

	var value = model.get('value');
	if (model.valueLookup[ value ]) {
	    value = model.valueLookup[ value ];
	}

	return value + ' of ' + model.get('suit');
    }
});


});
