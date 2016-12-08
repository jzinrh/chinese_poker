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

		var plays = _.filter(ClientApp.get('log'), function(logItem) {
			return !!logItem.cards;
		});
		var lastPlay = _.last(plays);

		var gameLog = ClientApp.get('log');

		// Hack for 3 of Diamonds
		if (isValidHand && !plays.length) {
			isValidHand = _.any(cards, function(card) {
				return (
					Number(card.get('value')) === 3
					&& card.get('suit') === 'Diamonds'
				);
			});
		}

		if (!lastPlay || !isValidHand || lastPlay.pass) {
			return isValidHand;
		}

		// TODO make sure that all cards in stack and selectedCards are sorted.
		var lastPlayCards = lastPlay.cards;
		if (lastPlayCards.length !== cards.length) {
			isValidNextPlay = false;
		}
		else if (_.contains([1,2,3], lastPlayCards.length)) {
			var lastPlayCompareCard = _.max(lastPlayCards, app.compareCardValue);
			var compareCard = _.max(cards, app.compareCardValue);

			isValidNextPlay = app.firstCardIsGreaterThanSecond(compareCard, lastPlayCompareCard);
		}
		else if (lastPlayCards.length == 5) {
			isValidNextPlay = app.firstHandIsGreaterThanSecond(cards, lastPlayCards);
		}

		return isValidNextPlay;
	},

	compareCardValue: function(card) {
		// Cheap trick to order first by rank, then by suit.
		var value = card.compareValue();
		var compareValue = value * 10;

		compareValue += card.suitValue();

		return compareValue;

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
			return card.compareValue();
		});

		var mostProminentCard = _.chain(groupedCards)
			.max(function(sameCards, rank) {
				return sameCards.length;
			})
			.first()
			.value();
		var mostProminentCardValue = mostProminentCard.get('value');

		var uniqueCards = _.sortBy(
			_.keys(groupedCards),
			function(cardValue) {
				return Number(cardValue);
			}
		);

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

		// I have not enjoyed writing 5 card hand validation because I am very lazy.
		var validWrappedStraights = {
			'3451415' : true,
			'345614': true
		};

		var joinedCardString = _.reduce(uniqueCards, function(a, b) {
			return a + '' + b;
		});

		var isFlush = ( uniqueSuits.length == 1 );
		var isStraight = (
			( uniqueCards.length == 5 )
			&& (
				( Number(uniqueCards[0]) + 4 ) == Number(uniqueCards[4])
				||
				validWrappedStraights[ joinedCardString ]
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
	},

	firstCardIsGreaterThanSecond: function(first, second) {
		var app = this;

		var firstCompareValue = app.compareCardValue(first);
		var secondCompareValue = app.compareCardValue(second);

		return ( firstCompareValue > secondCompareValue );
	},

	mostProminentCard: function(cards) {
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

		return mostProminentCard;
	},

	firstHandIsGreaterThanSecond: function(first, second) {
		var app = this;

		var handRank = app.fiveCardHandRank();
		var firstHandType = app.fiveCardHandType(first);
		var secondHandType = app.fiveCardHandType(second);
		var firstHandRank = handRank[ firstHandType ]
		var secondHandRank = handRank[ secondHandType ]

		var firstHandIsGreater = ( firstHandRank > secondHandRank );
		if (firstHandRank === secondHandRank) {
			var firstCompareCard = _.max(first, app.compareCardValue);
			var secondCompareCard = _.max(second, app.compareCardValue);
			var firstCardIsGreater = app.firstCardIsGreaterThanSecond(firstCompareCard, secondCompareCard);

			if (_.contains(['Flush', 'Straight Flush'], firstHandType)) {
				firstHandIsGreater = (
					firstCompareCard.suitValue() > secondCompareCard.suitValue()
					|| (
						firstCompareCard.suitValue() === secondCompareCard.suitValue()
						&& firstCardIsGreater
					)
				);
			}
			else if (firstHandType === 'Straight') {
				firstHandIsGreater = firstCardIsGreater;
			}
			else if (_.contains(['Full House', 'Bomb'], firstHandType)) {
				firstHandIsGreater = app.firstCardIsGreaterThanSecond(
					app.mostProminentCard(first),
					app.mostProminentCard(second)
				);
			}
		}

		return firstHandIsGreater;
	}

});

return new cardApp();

});
