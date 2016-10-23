define("collections/card", [
	'models/card',
	'backbone'
], function(
	Card,
	Backbone
) {

return Backbone.Collection.extend({
	model: Card
});

});
