define("app", [
    'backbone',
    'underscore',
    'models/game'
], function(
    Backbone,
    _,
    Game
) {

return Backbone.Model.extend({    
    newGame: function(args) {
	var app = this;
	app.game = Game;
	Game.set('playerNames', args.playerNames);
	Game.deal();
    },

    getPlayer: function(args) {
	var app = this;

	var playerName = args.name;

	var player = _.find(Game.get('players'), function(player) {
	    return playerName === player.get('name');
	});

	return player;
    },

    nextActivePlayer: function(args) {
	var app = this;

	var activePlayer = app.activePlayer();
	var players = Game.get('players');
	var playerIndex = _.findIndex(players, function(player) {
	    return activePlayer.cid === player.cid;
	});

	var nextPlayerIndex = ( playerIndex + 1 ) % players.length;
	var nextPlayer = players[ nextPlayerIndex ];

	return app.activePlayer({ activePlayer: nextPlayer });
    },
    
    activePlayer: function(args) {
	var app = this;

	if (args && args.activePlayer) {
	    Game.set('activePlayer', args.activePlayer);
	}

	return Game.get('activePlayer');
    },
    
    isValidHand: function(cards) {
	var app = this;

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

	return isValid;
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

	return selectedHand;
    }
});

});
