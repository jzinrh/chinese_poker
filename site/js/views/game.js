define("views/game", [
    'app',
    "views/player",
    "models/game",
    "template!templates/player_hand.hbs",
    "template!templates/played_card.hbs",
    'underscore'
], function(
    CardApp,
    PlayerView,
    GameModel,
    PlayerHandTemplate,
    PlayedCardTemplate,
    _
) {

return Backbone.View.extend({
    events: {
	'click .card': 'toggleCardSelected'
    },

    initialize: function() {
	var view = this;

	view.playerNames = [
	    'Jim',
	    'John',
	    'Dave',
	    'Nurus'
	];

	view.app = {};
	view.app[ 'card' ] = new CardApp();
	view.app[ 'card' ].newGame({
	    playerNames: view.playerNames
	});
    },

    render: function() {
	var view = this;

	var activePlayer = view.app[ 'card' ].activePlayer();

	_.each(view.playerNames, function(playerName) {
	    var player = view.app[ 'card' ].getPlayer({
		name: playerName
	    });
	    var isActivePlayer = ( player.cid === activePlayer.cid );

	    var templateArgs = {
		playerName: playerName
	    };

	    view.$el.append(PlayerHandTemplate(templateArgs));

	    var $player = view.$el.find('#player-'+ playerName);

	    $player.toggleClass('active-player', isActivePlayer);

	    var playerHTML = $player.get(0);
	    
	    new PlayerView({
		el: playerHTML
	    }).render();
	});

	view.listenTo(GameModel, 'played', function(args) {
	    var players = GameModel.get('players');
	    var playerIndex = _.findIndex(players, function(player) {
		return args.player.cid === player.cid
	    });
	    var nextPlayerIndex = ( playerIndex + 1 ) % players.length;

	    console.log(nextPlayerIndex);

	    var nextPlayer = players[ nextPlayerIndex ];
	    view.app[ 'card' ].activePlayer({ activePlayer: nextPlayer });

	    view.$el.find('#game-log').append(
		PlayedCardTemplate({
		    player: args.player.get('name'),
		    contents: args.cards
		})
	    );
	});
    }

});

});
