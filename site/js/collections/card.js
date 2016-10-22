define("collections/card", [
    'backbone',
    'underscore',
    'models/card'
], function(
    Backbone,
    _,
    Card
) {
return Backbone.Collection.extend({

    model: Card,

    to_string: function(prefix) {
    	var cards = this;

    	var strings = cards.map(function(card) {
    	    var string = "";
    	    if (prefix) {
    		string += prefix;
    	    }
    	    string += card.to_string();
    	    return string;
    	});

    	return _.reduce(strings, function(a, b) {
    	    return a + "\n" + b;
    	});
    }

});

});
