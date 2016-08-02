exports.get = function() {
    var style = {
    	mainView: {
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL,
		    layout: 'vertical'
		},
		
		gridButtonsView: {
			backgroundColor: '#fff',
			top: UI.top(0),
			zIndex: 49,
		    width: Ti.UI.FILL,
		    height: UI.height(30)
		},
		
		gridButtons: {
		    width: UI.width(20),
		    height: UI.height(20)
		},
		
		feedRow: {
			backgroundColor: '#fff',
		    width: Ti.UI.FILL,
		    height: UI.height(350),
		    layout: 'vertical'
		},
		
		feedColumn: {
			backgroundColor: '#fff',
		    height: UI.height(197),
		    layout: 'vertical'
		},
		
		lblTitle: {
			left: UI.left(10),
			right: UI.right(10),
			top: UI.top(5),
			height: UI.height(16),
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT,
                // fontWeight: 'bold'
            },
            color: '#404142',
			textAlign: 'left'
	    },
	    
	    lblBrand: {
			left: UI.left(10),
			right: UI.right(10),
			top: UI.top(0),
			height: UI.height(15),
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#ef4e6d',
			textAlign: 'left'
	    },

	    imgProduct: {
			// width: UI.width(300),
			height: UI.height(280)
	    },
	    
	    pricingView: {
	    	top: UI.top(3),
			left: UI.left(10),
			right: UI.right(10),
			height: UI.height(20),
			layout: 'horizontal'
	    },
	    
	    priceLabels: {
	    	left: 0,
	    	width: Ti.UI.SIZE,
            color: '#858585',
			textAlign: 'left'
	    },
	    
	    lblLikesLabel: {
	    	left: 0,
	    	width: Ti.UI.SIZE,
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#000',
			textAlign: 'left'
	    },
	    
	    originalPriceView: {
	    	left: 0,
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.FILL,
	    	borderColor: 'red'
	    },
	    
	    originalPriceStrike: {
	    	// backgroundColor: '#000',
	    	left: 0,
	    	width: Ti.UI.FILL,
	    	height: 1
	    }
    };
    
    return style;    
};
