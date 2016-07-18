exports.get = function() {
    var style = {
		mainView: {
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL,
		    layout: 'vertical'
		},
		
		profileView: {
			width: Ti.UI.FILL,
		    top: UI.top(10),
		    height: Ti.UI.SIZE,
		    layout: 'vertical'
		},
		
		summaryView: {
			// left: UI.left(10),
		    // right: UI.right(5),
		    top: UI.top(0),
		    width: UI.width(305),
		    height: Ti.UI.SIZE,
		    // layout: 'horizontal'
		},
		
		imgProfilePic: {
			defaultImage: '/images/common/profile-icon.png',
			left: 0,
			top: UI.top(10),
			width: UI.width(60),
			height: UI.height(60),
			borderRadius: UI.width(30)
	    },
	    
	    profileContentsView: {
	    	left: UI.left(70),
	    	// right: UI.right(5),
	    	width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: 'vertical'
	    },
	    
	    usernameAndEditButtonView: {
	    	width: Ti.UI.FILL,
	    	height: Ti.UI.SIZE
	    },
	    
	    usernameAndLocationView: {
	    	left: 0,
	    	width: UI.width(150),
	    	height: Ti.UI.SIZE,
	    	layout: 'vertical'
	    },
	    
	    imgFeaturedUser: {
	    	image: '/images/common/ic-featured-user.png',
	    	top: 0,
	    	right: UI.right(80),
			width: UI.width(16),
			height: UI.height(16)
	    },
		
	    btnEditProfilePic: {
	    	title: 'Edit',
	    	top: 0,
			right: 0,
	    	width: UI.width(50),
            height: UI.height(30),
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            backgroundColor: '#828282',
            color: '#fff',
            bubbleParent: false  
	    },
		
	    lblUsername: {
	    	left: 0,
	    	// right: 0,
			height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(15),
                fontFamily: constant.FONT.ABEATBYKAI,
                // fontWeight: 'bold'
            },
            color: '#eb5783',
			textAlign: 'left'
	    },
		
		lblLocation: {
			top: UI.top(5),
			left: 0,
	    	// right: 0,
			height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#b3b3b3',
			textAlign: 'left'
	    },
	    
	    followView: {
			right: 0,
			top: UI.top(10),
			height: Ti.UI.SIZE,
			layout: 'horizontal'
	    },

	    lblListed: {
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
			textAlign: 'left'
	    },
	    
	    lblListedCount: {
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT,
                // fontWeight: 'bold'
            },
            color: '#eb5783',
			textAlign: 'left'
	    },
	    
	    lblVSeparator: {
	    	backgroundColor: '#b3b3b3',
	    	width: 1,
	    	height: UI.height(10)
	    },
	    
	    selectedButton: {
	    	backgroundColor: '#ef4e6d',
            color: '#fff'
	    },
	    
	    unselectedButton: {
	    	backgroundColor: 'transparent',
            color: '#808080'
	    },
	    
	    itemView: {
	    	// left: UI.left(10),
	    	// top: UI.top(10),
	    	// width: UI.width(135),
	    	height: UI.height(135)
	    }
    };
    
    return style;    
};
