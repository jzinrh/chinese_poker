define("views/player", [
	'views/card',
	'app/card',
	'template!templates/card.hbs',
	'template!templates/card_row.hbs'
], function(
	CardView,
	CardApp,
	CardTemplate,
	CardRowTemplate
) {

return Backbone.View.extend({
	events: {
		'click .card-row:not(.disabled) .card': 'toggleCardSelected',
		'click .enabled.play-button': 'playSelectedCards',
		'click .enabled.pass-button': 'passTurn',
		'click .enabled.pass-other-button': 'passOtherTurn'
	},

	initialize: function(args) {
		var view = this;

		view.gameCode = args.gameCode;
		view.player = args.player;
		view.activePlayer = args.activePlayer;
		view.cards = args.cards;
		view.socket = args.socket;
	},

	/********************************************************************************
	 * render
	 *
	 * Description:
	 *  Render the in-game player view, and attach in-game listeners.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	render: function() {
		var view = this;

		view.$el.append(CardRowTemplate());

		view._renderHand();

		view._syncButtons();

		view.attachListeners();
	},

	_syncButtons: function() {
		var view = this;

		view.$el.find('.pass-other-button').toggleClass('enabled', view.activePlayer !== view.player.get('name'));
		view.$el.find('.pass-button').toggleClass('enabled', view.activePlayer === view.player.get('name'));
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

		var isValidHand = CardApp.isValidHand(cards);
		if (isValidHand) {
			selectedHandHTML = CardApp.handDisplayString(cards);
		}

		$selectedHand.html(selectedHandHTML);

		var playButtonEnabled = ( isValidHand && view.isActivePlayer );
		view.$el.find('.play-button').toggleClass('enabled', playButtonEnabled);
		view.$el.find('.pass-button').toggleClass('enabled', !!view.isActivePlayer);
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
			game: view.gameCode,
			name: view.player.get('name'),
			cards: view.selectedCards
		});

		view._renderHand();
		view._syncButtons();
		view.updateSelected();
	},

	/********************************************************************************
	 * passTurn
	 *
	 * Description:
	 *  Pass the turn
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	passTurn: function() {
		var view = this;

		view.socket.emit('pass turn', {
			game: view.gameCode,
			name: view.player.get('name')
		});
	},

	/********************************************************************************
	 * passOtherTurn
	 *
	 * Description:
	 *  Pass the turn
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	passOtherTurn: function() {
		var view = this;

		view.socket.emit('pass turn', {
			game: view.gameCode,
			name: view.activePlayer
		});
	},

	attachListeners: function() {
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

		view.socket.on('active player', function(activePlayer) {
			view.activePlayer = activePlayer;
			view.isActivePlayer = (activePlayer === view.player.get('name'));
			view._syncButtons();
		});

		return false;
	}

});

});
