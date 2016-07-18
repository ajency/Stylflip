exports.get = function() {
    var style = {
		mainView: {
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL
		},
		
		feedView: {
			// bottom: UI.bottom(50),
			top: 0,
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL
		},
		
		newFeedView: {
			backgroundColor: '#828282',
			// bottom: 0,
			top: 0,
			width: Ti.UI.FILL,
			height: UI.height(50),
			// borderColor: '#ebebeb',
            // borderWidth: 1
            zIndex: 1
		},
		
		btnCreateNewFeedView: {
			width: UI.width(30),
			height: UI.height(30)
		},
		
		btnCreateNewFeed: {
			width: UI.width(15),
			height: UI.height(13)
		},
		
		lblNewFeedHint: {
            backgroundColor: 'transparent',
            text: 'Styl on your mind? Post it here',
            left: UI.left(45),
            width: Ti.UI.SIZE,
            height: UI.height(40),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff',
            textAlign: 'left'
		},
		
		txtNewFeed: {
            backgroundColor: 'transparent',
            borderColor: '#ebebeb',
            borderWidth: 1,
            left: UI.left(10),
            width: UI.width(240),
            height: UI.height(40),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#737373',
            paddingLeft: 5,
            maxLength: 100,
            textAlign: 'left',
            hintText: 'Enter feed here',
            bubbleParent: false
		},
		
		feedRow: {
			backgroundColor: '#fff',
		    width: Ti.UI.FILL,
		    height: Ti.UI.SIZE,
		    layout: 'vertical'
		},
		
		profileView: {
			top: UI.top(10),
			width: Ti.UI.FILL,
		    height: Ti.UI.SIZE
	    },
		
		imgProfilePic: {
			defaultImage: '/images/common/profile-icon.png',
			left: UI.left(10),
			top: UI.top(0),
			width: UI.width(30),
			height: UI.height(30),
			borderRadius: UI.width(15)
	    },
		
		lblUsername: {
			left: UI.left(50),
			right: UI.right(50),
			top: UI.top(0),
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
			right: UI.right(85),
			top: UI.top(20),
			font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#b3b3b3',
			textAlign: 'left'
	    },
	    
	    btnHidePost: {
	    	top: UI.top(0),
			right: UI.right(10),
			width: UI.width(30),
			height: UI.height(30),
			bubbleParent: false
	    },
	    
	    lblVSeparator: {
	    	backgroundColor: '#b3b3b3',
	    	width: 1,
	    	height: UI.height(10)
	    },
	    
	    lblStatus: {
			left: UI.left(10),
			right: UI.right(10),
			top: UI.top(5),
			height: Ti.UI.SIZE, // UI.height(20),
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#404142',
			textAlign: 'left'
	    },
	    
	    imgProduct: {
			height: UI.height(280)
	    },
	    
	    commentsView: {
	    	top: UI.top(10),
	    	bottom: UI.bottom(10),
			left: UI.left(10),
			right: UI.right(10),
			height: _commonStyle.likeButton.height,
			layout: 'horizontal',
			borderColor: osname == 'android' ? 'red' : 'transparent',
			borderWidth: 0
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
	    }
    };
    
    return style;    
};
