define("views/registration", [
	'template!templates/new_player.hbs'
], function(
	NewPlayerTemplate
) {

return Backbone.View.extend({
	events: {
		'click .join-button': 'join'
	},

	initialize: function(args) {
		var view = this;

		view.socket = args.socket;
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

		var gameArgs = {
			name: view.$playerName.val(),
			game: view.$gameCode.val()
		};

		view.socket.emit('join', gameArgs);
	}

});

});
