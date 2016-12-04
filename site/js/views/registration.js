define("js/views/registration", [
	'template!templates/new_player.hbs',
	'js/app/client'
], function(
	NewPlayerTemplate,
	ClientApp
) {

return Backbone.View.extend({
	events: {
		// TODO: validation on join button
		'click .join-button': 'join',
		'click .create-button': 'create',
		'click .enabled.start-button': 'start'
	},

	initialize: function(args) {
		var view = this;

		view.socket = ClientApp.socket;
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

		view.$el.html(
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

		view.socket.on('started', function(args) {
			view.$el.hide();
		});

		ClientApp.on('change:gameCode', function() {
			view.createdGameCode = ClientApp.get('gameCode');
			view.$el.find('.join-button').hide();
			view.$el.find('.create-button').hide();
			view.$el.find('.game-code-row').hide();
		});

		ClientApp.on('change:playerNames', function() {
			var playerNames = ClientApp.get('playerNames');

			view.$el.find('.start-button').toggleClass('enabled', playerNames.length > 2);
		});

		view.attachedListeners = true;
	},

	/********************************************************************************
	 * create
	 *
	 * Description:
	 *  Join a game.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	create: function() {
		var view = this;

		ClientApp.createGame({
			name: view.$playerName.val()
		});
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

		ClientApp.joinGame({
			name: view.$playerName.val(),
			game: view.$gameCode.val()
		});
	},

	/********************************************************************************
	 * start
	 *
	 * Description:
	 *  Start a game.
	 *
	 * Return:
	 *  Not meaningful.
	 ********************************************************************************/
	start: function() {
		var view = this;

		ClientApp.startGame({
			game: view.createdGameCode
		});
	}


});

});
