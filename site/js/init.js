/*
 * requirejs handles dependencies, most third-party libraries need to
 * be defined here to be used in our views.
 */
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
	'jquery',
	'views/player'
], function(
	$,
	PlayerView
) {
	$(function() {
		var $newPlayer = $('#game');

		var player = new PlayerView({
			el: $newPlayer
		});

		player.render();
	});
});

