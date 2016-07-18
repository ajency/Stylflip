exports.get = function() {
    var style = {
    	mainView: {
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL
		},
		
		contentView: {
		    width: Ti.UI.FILL,
		    height: constant.CONTENT_HEIGHT,
		    showVerticalScrollIndicator: true,
            contentHeight: 'auto',
            contentWidth: Ti.UI.FILL,
            layout: 'vertical'
		},
		
		lblStatus: {
			left: UI.left(10),
			right: UI.right(10),
			top: UI.top(10),
			height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#404142',
			textAlign: 'left'
	    },
		
		profileView: {
			left: UI.left(0),
			top: UI.top(0),
			height: Ti.UI.SIZE
		},
		
		imgProfilePic: {
			defaultImage: '/images/common/profile-icon.png',
			left: UI.left(10),
			top: UI.top(10),
			width: UI.width(30),
			height: UI.height(30),
			borderRadius: UI.width(15)
	    },
		
		lblUsername: {
			left: UI.left(50),
			right: UI.right(10),
			top: UI.top(10),
			height: UI.height(20),
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#404142',
			textAlign: 'left'
	    },
		
		lblTimeAndLocation: {
			left: UI.left(50),
			right: UI.right(10),
			top: UI.top(30),
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#b3b3b3',
			textAlign: 'left'
	    },
	    
	    imgProduct: {
			height: Ti.UI.SIZE // UI.height(300)
	    },
	    
	    btnDonateView: {
	    	top: UI.top(10),
	    	right: UI.right(10),
	    	width: UI.width(30),
	    	height: UI.height(30),
	    	bubbleParent: false
	    },
	    
	    btnDonate: {
	    	backgroundImage: '/images/shop/ic-donate.png',
	    	width: UI.width(18),
	    	height: UI.height(18)
	    },
	    
	    pricingView: {
	    	top: UI.top(10),
			left: UI.left(10),
			right: UI.right(10),
			height: Ti.UI.SIZE, // UI.height(30),
			layout: 'horizontal'
	    },
	    
	    priceLabels: {
	    	left: 0,
	    	width: Ti.UI.SIZE,
            color: '#828282',
			textAlign: 'left'
	    },
	    
	    buttonView: {
	    	top: UI.top(10),
	    	width: UI.width(300),
	    	height: UI.height(30),
	    	borderColor: '#858585',
	    	borderWidth: 1,
	    	layout: 'horizontal'
	    },
	    
	    button: {
	    	width: UI.width(100.6),
	    	height: Ti.UI.FILL,
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
            borderColor: '#858585',
	    	borderWidth: 1
	    },
	    
	    lblDescription: {
	    	left: UI.left(10),
	    	right: UI.right(10),
	    	top: UI.top(10),
	    	height: Ti.UI.SIZE,
	    	font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
			textAlign: 'left'
	    },
	    
	    commentsView: {
	    	top: UI.top(10),
			left: UI.left(10),
			right: UI.right(10),
			height: UI.height(50),
			layout: 'horizontal'
	    },
	    
	    lblLikesView: {
	    	left: UI.left(10),
	    	width: UI.width(193.5),
	    	layout: 'horizontal'
	    },
	    
	    lblLikesCount: {
	    	left: 0,
	    	width: Ti.UI.SIZE,
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#000',
			textAlign: 'left'
	    },
	    
	    lblLikesLabel: {
	    	left: 0,
	    	width: Ti.UI.SIZE,
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
			textAlign: 'left'
	    },
	    
	    // originalPriceView: {
	    	// left: 0,
	    	// width: Ti.UI.SIZE,
	    	// height: Ti.UI.SIZE
	    // },
// 	    
	    // strikeView: {
	    	// backgroundColor: '#000',
	    	// height: 1
	    // }
    };
    
    return style;    
};
