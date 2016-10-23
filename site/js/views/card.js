define("views/card", [
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
    },

    render: function() {
	var view = this;

	var card = view.card;
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

	var cardTemplates = [
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

	var cardTemplate = cardTemplates[ card.get('value') - 1 ];
	var suitContext = suitContexts[ card.get('suit') ];

	if (cardTemplate) {
	    view.$el.append(
		cardTemplate({
		    suit: suitContext
		})
	    );
	}
    }

});

});
