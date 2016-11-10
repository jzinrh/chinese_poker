define("views/registration", [
	'template!templates/new_player.hbs',
	'app/client'
], function(
	NewPlayerTemplate,
	ClientApp
) {

return Backbone.View.extend({
	events: {
		// TODO: validation on join button
		'click .join-button': 'join'
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

		view.socket.on('begin', function(args) {
			view.$el.hide();
		});

		view.attachedListeners = true;
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
	}

});

});
