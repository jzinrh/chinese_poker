define("models/player", [
    'backbone',
    'models/card',
    'collections/card',
    'underscore'
], function(
    Backbone,
    Card,
    CardCollection,
    _
) {

return Backbone.Model.extend({

    // initialize: function(args) {
    // 	var player = this;

    // 	if (args.hand) {
    // 	    var cards = _.map(args.hand, function(cardContext) {
    // 		return new Card(cardContext);
    // 	    });
    // 	    player.set('hand', new CardCollection(cards));
    // 	}

    // 	return;
    // },
    

    to_string: function() {
	var player = this;

	var playerHand = player.get('hand');
	console.log(playerHand.length);
	
	var handString = playerHand.to_string("\t")

	return player.get('name') + "\n" + handString + "\n";
    }
});

});
