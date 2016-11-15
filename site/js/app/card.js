//TODO: this should probably be a base version, because it uses client

define("js/app/card", [
	'backbone',
	'underscore',
	'js/app/client'
], function(
	Backbone,
	_,
	ClientApp
) {

var cardApp = Backbone.Model.extend({

	isValidHand: function(cards) {
		var app = this;

		if (!cards) {
			cards = ClientApp.selectedCards();
		}

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
		else if (cards.length == 5) {
			var handType = app.fiveCardHandType(cards);

			isValid = !!handType;
		}

		return isValid;
	},

	isValidNextPlay: function() {
		var app = this;

		var cards = ClientApp.selectedCards();
		var isValidHand = app.isValidHand(cards);

		var isValidNextPlay = isValidHand;

		var stack = _.filter(ClientApp.get('stack'), function(play) {
			return !play.pass;
		});

		var lastPlay = _.last(stack);

		if (!lastPlay || !isValidHand || lastPlay.pass) {
			return isValidHand;
		}

		// TODO make sure that all cards in stack and selectedCards are sorted.
		var lastPlayCards = lastPlay.cards;
		if (lastPlayCards.length !== cards.length) {
			isValidNextPlay = false;
		}
		else if (_.contains([1,2,3], lastPlayCards.length)) {
			var lastPlayCompareCard = _.max(lastPlayCards, app.maxCardValue);
			var compareCard = _.max(cards, app.maxCardValue);

			if (lastPlayCompareCard.get('value') > compareCard.get('value')) {
				isValidNextPlay = false;
			}
			else if (lastPlayCompareCard.get('value') == compareCard.get('value')) {
				isValidNextPlay = (
					lastPlayCompareCard.suitValue() < compareCard.suitValue()
				);
			}
		}
		else if (lastPlayCards.length == 5) {
			var handRank = app.fiveCardHandRank();
			var lastHandType = app.fiveCardHandType(lastPlayCards);
			var lastPlayLastCard = lastPlayCards[4];
			var handType = app.fiveCardHandType(cards);
			var lastCard = cards[4];
			var lastCardIsHigher = app.isFirstCardGreaterThanSecond(lastCard, lastPlayLastCard);
			var mostProminentCard = app.mostProminentCard(cards);
			var lastPlayMostProminentCard = app.mostProminentCard(lastPlayMostProminentCard);
			var mostProminentCardIsHigher = app.isFirstCardGreaterThanSecond(
				mostProminentCard,
				lastPlayMostProminentCard
			);

			if (handRank[ lastHandType ] > handRank[ handType ]) {
				isValidNextPlay = false;
			}
			else if (handRank[ lastHandType ] < handRank[ handType ]) {
				isValidNextPlay = true;
			}
			else if (handType === 'Straight') {
				isValidNextPlay = lastCardIsHigher;
			}
			else if (_.contains(['Flush', 'Straight Flush'], handType)) {
				isValidNextPlay = (
					lastPlayLastCard.suitValue() < lastCard.suitValue()
					|| (
						lastPlayLastCard.suitValue() == lastCard.suitValue()
						&& lastCardIsHigher
					)
				);
			}
			else if (_.contains(['Full House', 'Bomb'], handType)) {
				isValidNextPlay = mostProminentCardIsHigher;
			}
		}

		return isValidNextPlay;
	},

	maxCardValue: function(card) {
		return card.get('value');
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
		else if (cards.length == 5) {
			var handType = app.fiveCardHandType(cards);
			cards = _.sortBy(cards, function(card) {
				return card.get('value');
			});

			var shortStrings = _.map(cards, function(card) { return card.toShortString() });
			selectedHand = handType + ' [' + _.reduce(shortStrings, function(a, b) {
				return a + ', ' + b;
			}) + ']';
		}

		return selectedHand;
	},

	fiveCardHandRank: function() {
		return {
			'Straight': 1,
			'Flush': 2,
			'Full House': 3,
			'Bomb': 4,
			'Straight Flush': 5
		};
	},

	fiveCardHandType: function(cards) {
		var app = this;

		var groupedCards = _.groupBy(cards, function(card) {
			return card.get('value');
		});

		var mostProminentCard = _.chain(groupedCards)
			.max(function(sameCards, rank) {
				return sameCards.length;
			})
			.first()
			.value();
		var mostProminentCardValue = mostProminentCard.get('value');

		var uniqueCards = _.keys(groupedCards).sort();
		var uniqueSuits = _.uniq(cards, function(card) {
			return card.get('suit');
		});

		var handType;

		if (uniqueCards.length == 2) {
			var prominentCardHandType;
			if ( groupedCards[ mostProminentCardValue ].length == 3 ) {
				handType = 'Full House';
			}
			else {
				handType = 'Bomb';
			}
		}

		var isFlush = ( uniqueSuits.length == 1 );
		var isStraight = (
			( uniqueCards.length == 5 )
			&& (
				( Number(uniqueCards[0]) + 4 ) == Number(uniqueCards[4])
			)
		);

		if (isFlush && isStraight) {
			handType = 'Straight Flush';
		}
		else if (isFlush) {
			handType = 'Flush';
		}
		else if (isStraight) {
			handType = 'Straight';
		}

		return handType;
	}

});

return new cardApp();

});
