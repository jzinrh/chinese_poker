define("models/game", [
    'models/deck',
    'models/player',
    'collections/card',
    'backbone',
    'underscore',
], function(
    Deck,
    Player,
    CardCollection,
    Backbone,
    _
) {

var game = Backbone.Model.extend({
    addPlayer: function(name) {
	var game = this;

	var playerNames = game.get('playerNames');
	if (!playerNames ) {
	    playerNames = [];
	}

	playerNames.push(name);

	game.set('playerNames', playerNames);
    },

    deal: function() {
	var game = this;

	var deck = new Deck();

	var handsByPlayer = {};
	var card = deck.pop();
	var playerNames = game.get('playerNames');

	while (card && playerNames && playerNames.length) {
	    _.each(playerNames, function(playerName) {
		if (!handsByPlayer[ playerName ]) {
		    handsByPlayer[ playerName ] = [];
		}

		if (card) {
		    handsByPlayer[ playerName ].push(card);
		    card = deck.pop();
		}
	    });
	}

	var players = _.map(game.get('playerNames'), function(playerName) {
	    var sortedHand = _.sortBy(handsByPlayer[ playerName ], function(card) {
		return card.get('value');
	    });

	    var lowestCard = _.find(sortedHand, function(card) {
		return (
		    Number(card.get('value')) === 3
		    && card.get('suit') === 'Diamonds'
		);
	    });

	    var playerHand = new CardCollection(sortedHand);

	    var player = new Player({
		name: playerName,
		hand: playerHand
	    });

	    if (lowestCard) {
		game.set('activePlayer', player);
	    }

	    return player;
	});

	game.set('players', players);
    },

    to_string: function() {
	var game = this;

	var strings = _.map(game.get('players'), function(player) {
	    return player.to_string();
	});

	return _.reduce(strings, function(a, b) {
	    return a + "\n" + b;
	});
    }
});

return new game;

});
