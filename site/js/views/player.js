define("views/player", [
	'models/player',
	'collections/card',
	'models/card',
	'views/card',
	'app',
	'socketio',
	'template!templates/card.hbs',
	'template!templates/card_row.hbs',
	'template!templates/new_player.hbs',
	"template!templates/played_card.hbs"
], function(
	Player,
	CardCollection,
	Card,
	CardView,
	CardApp,
	io,
	CardTemplate,
	CardRowTemplate,
	NewPlayerTemplate,
	PlayedCardTemplate
) {

return Backbone.View.extend({
	events: {
		'click .join-button': 'join',
		'click .card-row:not(.disabled) .card': 'toggleCardSelected',
		'click .enabled.play-button': 'playSelectedCards'
	},

	initialize: function() {
		var view = this;

		view.app = {};
		view.app[ 'card' ] = new CardApp();
	},

	/********************************************************************************
	 * render
	 *
	 * Description:
	 *  Render the 'registration' view, and attach general listeners.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	render: function() {
		var view = this;

		view.$el.find('.new-player').html(
			NewPlayerTemplate()
		);

		view.$playerName = view.$el.find('.player-name');
		view.$gameCode = view.$el.find('.game-code');

		view.attachListeners();
	},

	/********************************************************************************
	 * attachListeners
	 *
	 * Description:
	 *  Connect to the server via socketio.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	attachListeners: function() {
		var view = this;

		if (view.attachedListeners) {
			return;
		}

		view.attachedListeners = true;

		var url = 'http://localhost:8080';
		view.socket = io.connect(url);

		// When the game begins, switch to the in-game player view.
		view.socket.on('begin', function(args) {
			var player = args.player;

			view.isActivePlayer = (
				args.activePlayer === player.name
			);

			var cards = _.map(player.hand, function(card) {
				return new Card(card);
			});
			var playerHand = new CardCollection(cards);
			view.player = new Player({
				name: player.name,
				hand: playerHand
			});
			view.cards = view.player.get('hand');

			view._showPlayerView();
		});

	},

	/********************************************************************************
	 * _showPlayerView
	 *
	 * Description:
	 *  Render the in-game player view, and attach in-game listeners.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	_showPlayerView: function() {
		var view = this;

		view.$el.find('.new-player').hide();

		view.$el.append(CardRowTemplate());
		view._renderHand();

		view.attachCardListeners();
	},

	/********************************************************************************
	 * _renderHand
	 *
	 * Description:
	 *  Helper for _showPlayerView - empties the player's hand, and
	 *  then renders each card.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	_renderHand: function() {
		var view = this;

		var $hand = view.$el.find('.hand');
		$hand.html('');

		view.cards.map(function(card) {

			var $card = CardTemplate({
				value: card.get('value'),
				suit: card.get('suit')
			});

			var viewID = card.get('value') + '-' + card.get('suit');
			$hand.append($card);

			var $cardViewEl = $hand.find('#' + viewID);
			var cardView = new CardView({
				el: $cardViewEl,
				card: card
			});

			cardView.render();
		});

	},

	/********************************************************************************
	 * updateSelectedHand
	 *
	 * Description:
	 *  Take the plain-text string for the currently selected hand and
	 *  display it to the player.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	updateSelectedHand: function() {
		var view = this;

		var cards = view.selectedCards;
		var $selectedHand = view.$el.find('.selected-hand');

		var selectedHandHTML = '';

		var isValidHand = view.app[ 'card' ].isValidHand(cards);
		if (isValidHand) {
			selectedHandHTML = view.app[ 'card' ].handDisplayString(cards);
		}

		$selectedHand.html(selectedHandHTML);

		var playButtonEnabled = ( isValidHand && view.isActivePlayer );
		view.$el.find('.play-button').toggleClass('enabled', playButtonEnabled);
	},

	/********************************************************************************
	 * updateSelected
	 *
	 * Description:
	 *  Update the view's current selected cards.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	updateSelected: function() {
		var view = this;

		var selectedCards = view.cards.filter(function(card) {
			return card.get('selected');
		});

		view.selectedCards = selectedCards;

		view.updateSelectedHand();
	},

	/********************************************************************************
	 * toggleCardSelected
	 *
	 * Description:
	 *  Toggle the selected state of a card.
	 *
	 * Return:
	 *  False, to prevent event propagation.
	 ********************************************************************************/
	toggleCardSelected: function(event) {
		var view = this;

		var $card = $(event.target).closest('.card');

		var value = $card.data('value');
		var suit = $card.data('suit');
		var selected = $card.hasClass('selected');

		if (!selected && view.selectedCards && view.selectedCards.length == 5) {
			return false;
		}

		var selectedCard = view.cards.find(function(card) {
			return (
				card.get('value') === value
		&& card.get('suit') === suit
			);
		});

		$card.toggleClass('selected');
		selectedCard.set('selected', $card.hasClass('selected'));

		return false;
	},

	/********************************************************************************
	 * playSelectedCards
	 *
	 * Description:
	 *  Remove the selected cards from the player's hand and
	 *  communicate the play to the server.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	playSelectedCards: function() {
		var view = this;

		view.cards.remove(view.selectedCards);

		view.socket.emit('play cards', {
			game: view.$gameCode.val(),
			name: view.player.get('name'),
			cards: view.selectedCards
		});

		view._renderHand();
	},

	attachCardListeners: function() {
		var view = this;

		if (view.attachedCardListeners) {
			return false;
		}

		view.attachedCardListeners = true;

		view.listenTo(view.cards, 'change:selected', function() {
			view.updateSelected();
		});

		view.listenTo(view, 'change:isActivePlayer', function() {
			view.updateSelected();
		});

		view.socket.on('cards played', function(args) {
			var cards = _.map(args.cards, function(cardContext) {
				return new Card(cardContext);
			});

			var handDisplayString = view.app[ 'card' ].handDisplayString(cards);
			view.$el.find('.game-log').append(
				PlayedCardTemplate({
					player: args.name,
					contents: handDisplayString
				})
			);

			view.isActivePlayer = (
				args.activePlayer === view.player.get('name')
			);
		});

		return false;
	},


	/********************************************************************************
	 * join
	 *
	 * Description:
	 *  Join a game.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	join: function() {
		var view = this;

		var gameArgs = {
			name: view.$playerName.val(),
			game: view.$gameCode.val()
		};

		view.socket.emit('join', gameArgs);
	}

});

});
