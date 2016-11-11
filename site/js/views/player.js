define("views/player", [
	'views/card',
	'app/card',
	'app/client',
	'template!templates/card.hbs',
	'template!templates/card_row.hbs'
], function(
	CardView,
	CardApp,
	ClientApp,
	CardTemplate,
	CardRowTemplate
) {

return Backbone.View.extend({
	events: {
		'click .card-row:not(.disabled) .card': 'toggleCardSelected',
		'click .enabled.play-button': 'playSelectedCards',
		'click .enabled.pass-button': 'passTurnHandler',
		'click .enabled.pass-other-button': 'passActiveTurnHandler'
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

		var isActivePlayer = ClientApp.get('isActivePlayer');
		var isValidPlay = CardApp.isValidNextPlay();

		var playButtonEnabled = ( isValidPlay && isActivePlayer );
		view.$el.find('.play-button').toggleClass('enabled', playButtonEnabled);
		view.$el.find('.pass-other-button').toggleClass('enabled', !isActivePlayer);
		view.$el.find('.pass-button').toggleClass('enabled', isActivePlayer);
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

		var cards = ClientApp.get('cards');
		cards.map(function(card) {
			// TODO have template.js auto-convert models to hashes
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

		var selectedCards = ClientApp.selectedCards();
		var $selectedHand = view.$el.find('.selected-hand');

		var selectedHandHTML = '';

		var isValidHand = CardApp.isValidHand();
		if (isValidHand) {
			selectedHandHTML = CardApp.handDisplayString(selectedCards);
		}

		$selectedHand.html(selectedHandHTML);
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
		var selectedCards = ClientApp.selectedCards();
		if (!selected && selectedCards && selectedCards.length == 5) {
			return false;
		}

		var cards = ClientApp.get('cards');
		var selectedCard = cards.find(function(card) {
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

		ClientApp.playCards();

		view._renderHand();
		view._syncButtons();
		view.updateSelectedHand();
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
	passTurnHandler: function() {
		var view = this;

		ClientApp.passTurn();
	},

	/********************************************************************************
	 * passActiveTurnHandler
	 *
	 * Description:
	 *  Pass the turn
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	passActiveTurnHandler: function() {
		var view = this;

		ClientApp._passActiveTurn();
	},

	attachListeners: function() {
		var view = this;

		if (view.attachedCardListeners) {
			return false;
		}

		view.attachedCardListeners = true;

		var cards = ClientApp.get('cards');
		// TODO can we use change:selected here?
		cards.on('change:selected', function() {
			view.updateSelectedHand();
			view._syncButtons();
		});

		ClientApp.on('change:isActivePlayer', function() {
			view._syncButtons();
		});

		return false;
	}

});

});
