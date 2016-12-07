define("js/models/game", [
	'js/models/deck',
	'js/models/player',
	'js/collections/card',
	'backbone',
	'underscore'
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

		var lastCard;
		if (playerNames.length === 3) {
			lastCard = card;
			card = deck.pop();
		}

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
			var playerHand = handsByPlayer[ playerName ];
			var lowestCard = _.find(playerHand, function(card) {
				return (
					Number(card.get('value')) === 3
					&& card.get('suit') === 'Diamonds'
				);
			});

			// Give the last card to the player with the 3 of diamonds
			if (lastCard && lowestCard) {
				game.set('lastCard', lastCard);
				playerHand.push(lastCard);
			}

			var sortedHand = _.sortBy(playerHand, function(card) {
				return card.compareValue()
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
	}
});

return game;

});
