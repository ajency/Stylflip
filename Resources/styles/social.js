exports.get = function() {
    var style = {
		mainView: {
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL,
		    layout: 'vertical'
		},
		
		selectedButton: {
	    	backgroundColor: '#ef4e6d',
            color: '#fff'
	    },
	    
	    unselectedButton: {
	    	backgroundColor: 'transparent',
            color: '#858585'
	    },
		
	    buttonView: {
	    	top: UI.top(10),
	    	width: UI.width(280),
	    	height: UI.height(30),
	    	borderColor: '#858585',
	    	borderWidth: 1,
	    	layout: 'horizontal'
	    },
	    
	    button: {
	    	width: UI.width(140.5),
	    	height: Ti.UI.FILL,
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
            borderColor: '#858585',
	    	borderWidth: 1
	    },
	    
	    activityRow: {
	    	top: UI.top(10), 
	    	left: UI.left(60),
	    	right: 0,
            height: Ti.UI.SIZE,
            layout: 'vertical'
	    },
	    
	    lblActivity: {
	    	top: UI.top(0), 
	    	left: UI.left(0),
	    	right: UI.right(10),
            height: Ti.UI.SIZE,
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#000'
	    },
	    
	    profileView: {
	    	backgroundColor: '#fff',
		    left: 0,
		    right: 0,
		    height: UI.height(155)
		},
		
		imgProfilePic: {
			defaultImage: '/images/common/profile-icon.png',
			left: UI.left(10),
			top: UI.top(10),
			width: UI.width(30),
			height: UI.height(30),
			borderRadius: UI.width(15)
	    },
	    
	    lblUsernameView: {
			left: UI.left(50),
			right: UI.right(50),
			top: UI.top(5),
			height: UI.height(20),
			layout: 'horizontal'
	    },
	    
	    lblUsername: {
			left: 0,
			// right: UI.right(50),
			top: 0,
			width: Ti.UI.size,
			height: UI.height(20),
			font: {
                fontSize: UI.fontSize(12)
                // fontWeight: 'bold'
            },
            color: '#000',
			textAlign: 'left'
	    },
	    
	    imgFeaturedUser: {
	    	image: '/images/common/ic-featured-user.png',
	    	left: UI.left(5),
			width: UI.width(16),
			height: UI.height(16)
	    },
		
		lblLocation: {
			left: UI.left(50),
			right: UI.right(50),
			top: UI.top(25),
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
			textAlign: 'left'
	    },
	    
	    listedView: {
	    	left: UI.left(50),
			right: UI.right(10),
			top: UI.top(45),
			height: UI.height(20),
			layout: 'horizontal'
	    },

	    lblListed: {
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.FILL,
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
			textAlign: 'left'
	    },
	    
	    lblListedCount: {
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.FILL,
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
	    }
    };
    
    return style;    
};
