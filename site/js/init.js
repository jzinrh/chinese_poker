requirejs.config({
    shim: {
	'socketio': {
	    exports: 'io'
	}
    },
    paths: {
	jquery: 'js/lib/jquery-3.1.1.min',
	underscore: 'js/lib/underscore-min',
	backbone: 'js/lib/backbone-min',
	handlebars: 'js/lib/handlebars-min',
	template: 'js/lib/template',
	socketio: '../socket.io/socket.io'
    }
});

requirejs([
    'jquery'
], function(
    $
) {
	
	$(function() {
	
	    requirejs(["views/player"], function(playerView) {
	    	var $newPlayer = $('#game');
	
	    	var player = new playerView({
	    	    el: $newPlayer
	    	});
	
	    	player.render();
	    });
	
	    // requirejs(["views/game"], function(GameView) {
	    // 	var $game = $('#game');
	
	    // 	var game = new GameView({
	    // 	    el: $game
	    // 	});
	
	    // 	game.render();
	    // });
	});
});

