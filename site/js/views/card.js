define("js/views/card", [
	'template!templates/card/ace.hbs',
	'template!templates/card/two.hbs',
	'template!templates/card/three.hbs',
	'template!templates/card/four.hbs',
	'template!templates/card/five.hbs',
	'template!templates/card/six.hbs',
	'template!templates/card/seven.hbs',
	'template!templates/card/eight.hbs',
	'template!templates/card/nine.hbs',
	'template!templates/card/ten.hbs',
	'template!templates/card/jack.hbs',
	'template!templates/card/queen.hbs',
	'template!templates/card/king.hbs'
], function(
	AceTemplate,
	TwoTemplate,
	ThreeTemplate,
	FourTemplate,
	FiveTemplate,
	SixTemplate,
	SevenTemplate,
	EightTemplate,
	NineTemplate,
	TenTemplate,
	JackTemplate,
	QueenTemplate,
	KingTemplate
) {

return Backbone.View.extend({

	initialize: function(args) {
		var view = this;

		view.card = args.card;
		view.width = args.width;
	},

	render: function() {
		var view = this;

		var suit = view.$el.data('suit');
		var cardValue = view.$el.data('value');

		var cardTemplate = view._cardTemplate(cardValue);
		var suitContext = view._suitContext(suit);

		view.$el.append(
			cardTemplate({
				suit: suitContext
			})
		);

		var cardWidth = 80;
		if (view.width) {
			cardWidth = view.width;
		}

		view.setCardWidth(cardWidth);
	},

	setCardWidth: function(pixels) {
		var fontsize = pixels * 12.5 / 200;
		return this.$el.css({
			'font-size': "" + fontsize + "px"
		});
	},

	_suitContext: function(suit) {

		var suitContexts = {
			Clubs: {
				name: 'club',
				symbol: '♣',
				color: 'black'
			},
			Diamonds: {
				name: 'diamond',
				symbol: '&diams;',
				color: 'red'
			},
			Spades: {
				name: 'spade',
				symbol: '&spades;',
				color: 'black'
			},
			Hearts: {
				name: 'heart',
				symbol: '&hearts;',
				color: 'red'
			}
		};

		return suitContexts[ suit ];
	},

	_cardTemplate: function(value) {
		var templates = [
			AceTemplate,
			TwoTemplate,
			ThreeTemplate,
			FourTemplate,
			FiveTemplate,
			SixTemplate,
			SevenTemplate,
			EightTemplate,
			NineTemplate,
			TenTemplate,
			JackTemplate,
			QueenTemplate,
			KingTemplate
		];

		return templates[ value - 1 ];
	}
});

});
