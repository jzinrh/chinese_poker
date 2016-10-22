define("views/new_player", [
    'models/player',
    'template!templates/new_player.hbs',
    'socketio'    
], function(
    Game,
    newPlayerTemplate,
    io    
) {

return Backbone.View.extend({
    events: {
	'click .join-button': 'join'
    },

    render: function() {
	var view = this;
	var url = 'http://localhost:8080';
	view.socket = io.connect(url);

	view.$el.html(
	    newPlayerTemplate()
	);

	view.$playerName = view.$el.find('.player-name');
	view.$gameCode = view.$el.find('.game-code');

	view.socket.on('begin', function(player) {

	});
    },

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
