define("js/collections/card", [
	'js/models/card',
	'backbone'
], function(
	Card,
	Backbone
) {

return Backbone.Collection.extend({
	model: Card
});

});
